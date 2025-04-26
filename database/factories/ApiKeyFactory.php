<?php

namespace Database\Factories;
use App\Models\Apikey;
use MongoDB\BSON\ObjectId;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApiKey>
 */
class ApiKeyFactory extends Factory {

    protected $model = apikey::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'name' => $this->faker->company,
            'company' => new ObjectId(),
            'key' => $this->faker->uuid,
            'branches' => [
                new ObjectId()
            ],
            '__v' => 0
        ];
    }
}
