<?php

namespace Database\Factories;
use App\Models\Totemuser;
use MongoDB\BSON\ObjectId;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TotemUser>
 */
class TotemUserFactory extends Factory {

    protected $model = Totemuser::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {

        $total = Totemuser::count();

        return [
            'active' => true,
            'customerOf' => new ObjectId(),
            'branch' => new ObjectId(),
            'name' => 'totem' . $total,
            'email' => 'totem' . $total . '@klavi.app.br',
            'maxConcurrentLogins' => 1000,
            'tefIpAddress' => $this->faker->ipv4 . ':' . $this->faker->numberBetween,
            'tefCompany' => (string) $this->faker->numberBetween(10000000, 99999999),
            'tefCNPJ' => $this->faker->cnpj,
            'tefTerminal' => '000' . $this->faker->numberBetween(1, 3),
            'tefComunicacao' => (string) $this->faker->numberBetween(1, 3),
            'tefOtp' => (string) $this->faker->numberBetween(1000000000, 9999999999),
            'password' => Hash::make($this->faker->password(8, true, true)),
            'isVerified' => true,
            'iatVerify' => [],
            '__v' => 0
        ];
    }
}
