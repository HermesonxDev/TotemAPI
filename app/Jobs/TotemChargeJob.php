<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Complementsgroup;
use App\Models\Productcategory;
use App\Models\Totemcharge;
use MongoDB\BSON\ObjectId;
use App\Models\Product;

class TotemChargeJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $originalBranchId;
    protected $destinationBranchId;

    public function __construct($originalBranchId, $destinationBranchId) {
        $this->originalBranchId = $originalBranchId;
        $this->destinationBranchId = $destinationBranchId;
    }

    public function handle() {
        $originalBranchId = $this->originalBranchId;
        $destinationBranchId = $this->destinationBranchId;

        $start = microtime(true);

        $company = Product::where('branch', $originalBranchId)->where('deleted', '<>', true)->value('company');

        $totemCharge = new Totemcharge();
        $totemCharge->company = $company;
        $totemCharge->to = $originalBranchId;
        $totemCharge->from = $destinationBranchId;
        $totemCharge->details = [];
        $totemCharge->time = "";
        $totemCharge->status = 'running';
        $totemCharge->save();

        $products = Product::where('branch', $originalBranchId)->where('deleted', '<>', true)->get();
        $categories = Productcategory::where('branch', $originalBranchId)->where('deleted', '<>', true)->get();
        $complements = Complementsgroup::where('branch', $originalBranchId)->where('deleted', '<>', true)->get();

        Product::where('branch', $destinationBranchId)->delete();
        Productcategory::where('branch', $destinationBranchId)->delete();
        Complementsgroup::where('branch', $destinationBranchId)->delete();

        $categoryMap = [];
        $productMap = [];
        $complementGroupMap = [];

        foreach ($categories as $category) {
            $new = $category->replicate();
            $oldId = $category->_id;
            $new->branch = $destinationBranchId;
            $new->original_cloned_id = $oldId;
            unset($new->_id);
            $new->save();

            $categoryMap[(string) $oldId] = $new->_id;
        }

        foreach ($complements as $group) {
            $new = $group->replicate();
            $oldId = $group->_id;
            $new->branch = $destinationBranchId;
            $new->original_cloned_id = $oldId;
            unset($new->_id);
            $new->save();

            $complementGroupMap[(string) $oldId] = $new->_id;
        }

        foreach ($products as $product) {
            $new = $product->replicate();
            $oldId = $product->_id;

            $new->branch = $destinationBranchId;
            $new->original_cloned_id = $oldId;

            $categoryId = $categoryMap[(string) $product->category] ?? null;
            $new->category = $categoryId ? new ObjectId((string)$categoryId) : null;

            $new->complementsGroups = array_map(function ($groupId) use ($complementGroupMap) {
                return $complementGroupMap[(string) $groupId] ?? null;
            }, $product->complementsGroups ?? []);

            unset($new->_id);
            $new->save();

            $productMap[(string) $oldId] = $new->_id;
        }

        $end = microtime(true);
        $seconds = round($end - $start);
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        $totemCharge->time = "{$minutes}m {$remainingSeconds}s";
        $totemCharge->details = [
            'categoriesCloned' => count($categories),
            'productsCloned' => count($products),
            'complementsCloned' => count($complements),
            'executedAt' => now()
        ];
        $totemCharge->status = 'done';
        $totemCharge->save();
    }
}