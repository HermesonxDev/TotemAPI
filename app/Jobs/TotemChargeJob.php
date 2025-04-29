<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use App\Models\Productcategory;
use App\Models\Complementsgroup;
use App\Models\Complementsgroupscategory;
use App\Models\Totemcharge;
use MongoDB\BSON\ObjectId;

class TotemChargeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $originalBranchId;
    protected $destinationBranchId;

    public function __construct($originalBranchId, $destinationBranchId)
    {
        $this->originalBranchId = $originalBranchId;
        $this->destinationBranchId = $destinationBranchId;
    }

    public function handle()
    {
        $originalBranchId = $this->originalBranchId;
        $destinationBranchId = $this->destinationBranchId;
        $start = microtime(true);

        $company = Product::where('branch', $originalBranchId)
            ->where('deleted', '<>', true)
            ->value('company');

        $totemCharge = new Totemcharge();
        $totemCharge->company = $company;
        $totemCharge->to = $originalBranchId;
        $totemCharge->from = $destinationBranchId;
        $totemCharge->details = [];
        $totemCharge->time = "";
        $totemCharge->status = 'running';
        $totemCharge->save();

        // Carrega dados da branch original
        $products = Product::where('branch', $originalBranchId)
            ->where('deleted', '<>', true)
            ->get();

        $categories = Productcategory::where('branch', $originalBranchId)
            ->where('deleted', '<>', true)
            ->get();

        $complements = Complementsgroup::where('branch', $originalBranchId)
            ->where('deleted', '<>', true)
            ->get();

        $complementsCategories = Complementsgroupscategory::where('branch', $originalBranchId)
            ->where('deleted', '!=', true)
            ->get();

        // Deleta cardápio antigo da branch destino
        Product::where('branch', $destinationBranchId)->delete();
        Productcategory::where('branch', $destinationBranchId)->delete();
        Complementsgroup::where('branch', $destinationBranchId)->delete();
        Complementsgroupscategory::where('branch', $destinationBranchId)->delete();

        $categoryMap = [];
        $productMap = [];
        $complementGroupMap = [];
        $complementGroupCategoryMap = [];

        // Clonar categorias de grupos de complementos
        foreach ($complementsCategories as $category) {
            $new = $category->replicate();
            $oldId = $category->_id;

            $new->branch = $destinationBranchId;
            $new->original_cloned_id = (string) $oldId;
            unset($new->_id);

            $new->save();
            $complementGroupCategoryMap[(string) $oldId] = $new->_id;
        }

        // Clonar categorias de produtos
        foreach ($categories as $category) {
            $new = $category->replicate();
            $oldId = $category->_id;

            $new->branch = $destinationBranchId;
            $new->original_cloned_id = $oldId;
            unset($new->_id);

            $new->save();
            $categoryMap[(string) $oldId] = $new->_id;
        }

        // Clonar produtos
        foreach ($products as $product) {
            $new = $product->replicate();
            $oldId = $product->_id;

            $new->branch = $destinationBranchId;
            $new->original_cloned_id = $oldId;

            // Atualizar categoria
            $categoryId = $categoryMap[(string) ($product->category ?? '')] ?? null;
            $new->category = $categoryId ? new ObjectId((string) $categoryId) : null;

            // Atualizar complement groups
            $new->complementsGroups = array_filter(array_map(function ($groupId) use ($complementGroupMap) {
                return $complementGroupMap[(string) $groupId] ?? null;
            }, $product->complementsGroups ?? []));

            // Atualizar complement group category
            $complementGroupCategoryId = $complementGroupCategoryMap[(string) ($product->complementGroupCategory ?? '')] ?? null;
            $new->complementGroupCategory = $complementGroupCategoryId ? new ObjectId((string) $complementGroupCategoryId) : null;

            unset($new->_id);
            $new->save();

            $productMap[(string) $oldId] = $new->_id;
        }

        // Agora clonar os groups de complementos (depois dos products para pegar o mapa)
        foreach ($complements as $group) {
            $new = $group->replicate();
            $oldId = $group->_id;

            $new->branch = $destinationBranchId;
            $new->original_cloned_id = $oldId;

            // Atualizar categorias
            $new->categories = array_filter(array_map(function ($categoryId) use ($complementGroupCategoryMap) {
                return $complementGroupCategoryMap[(string) $categoryId] ?? null;
            }, $group->categories ?? []));

            // Atualizar itens
            $new->items = array_filter(array_map(function ($itemId) use ($productMap) {
                return $productMap[(string) $itemId] ?? null;
            }, $group->items ?? []));

            unset($new->_id);
            $new->save();

            $complementGroupMap[(string) $oldId] = $new->_id;
        }

        // Atualizar tempo e detalhes da operação
        $end = microtime(true);
        $seconds = round($end - $start);
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        $totemCharge->time = "{$minutes}m {$remainingSeconds}s";
        $totemCharge->details = [
            'categoriesCloned' => count($categories),
            'productsCloned' => count($products),
            'complementsCloned' => count($complements),
            'complementCategoriesCloned' => count($complementsCategories),
            'executedAt' => now()
        ];
        $totemCharge->status = 'done';
        $totemCharge->save();
    }
}