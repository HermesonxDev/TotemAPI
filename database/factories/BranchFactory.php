<?php

namespace Database\Factories;
use App\Models\Branch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Branch>
 */
class BranchFactory extends Factory {

    protected $model = Branch::class;
    
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            "name" => $this->faker->company,
            "phone" => "85-3333-3333",
            "company" => ObjectId("6441ae9a491d9eca5be7d146"),
            "barcodeReader" => false,
        ];
    }
}
