<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use MongoDB\BSON\UTCDateTime;
use Carbon\Carbon;
use MongoDB\BSON\ObjectId;

class OrderFactory extends Factory {
    
    protected $model = Order::class;

    public function definition(): array {
        return [
            'amount' => $this->faker->randomFloat(2, 10, 100),
            'subtotal' => $this->faker->randomFloat(2, 10, 100),
            'total' => $this->faker->randomFloat(2, 10, 100),
            'branch' => (string) new ObjectId('651f2c2d7cb1cb070575f679'),
            'inutriOrder' => null,
            'inutriOrderDeliveryAddress' => null,
            'change' => 0,
            'pinpadResponse' => null,
            'coupon' => null,
            'simpleAuth' => $this->faker->regexify('[A-Za-z0-9]{20}'),
            'totemClientName' => $this->faker->firstName . $this->faker->lastName,
            'cpfCustomer' => null,
            'totemNF_email' => null,
            'deliveryFee' => 0,
            'items' => [
                [
                    'product' => (string) new ObjectId('67226a404de3ba001afd7f4c'),
                    'name' => 'Combo delícia 1 - Big Filé',
                    'originalPrice' => 33.4,
                    'price' => 33.4,
                    'quantity' => 1,
                    'note' => null,
                    'complements' => [
                        [
                            '_id' => (string) new ObjectId('67226a3f4de3ba001afd7f4a'),
                            'price' => 6.5,
                            'quantity' => 1,
                            'complementGroup' => null
                        ]
                    ],
                    'relatedOffer' => null
                ]
            ],
            'location' => new \stdClass(),
            'totemVersion' => '2.0.1',
            'locationType' => 8,
            'offers' => [],
            'discount' => null,
            'paymentMethod' => [
                'data' => [
                    'name' => 'Dinheiro na entrega',
                    'active' => true,
                    'change' => 0
                ],
                'kind' => 'Totem',
                'label' => 'Dinheiro'
            ],
            'phone' => null,
            'withdrawalTime' => null,
            'note' => null,
            'appInfo' => null,
            'deliveryTime' => null,
            'additionalInfo' => 'Consumir no local',
            'installments' => 1
        ];
    }

    public function withDelivery(): static {
        return $this->state([
            'locationType' => 1,
            'deliveryFee' => 5.0,
            'location' => [
                'address' => $this->faker->streetAddress,
                'city' => $this->faker->city
            ]
        ]);
    }

    public function withCreditCard(): static {
        return $this->state([
            'paymentMethod' => [
                'data' => [
                    'name' => 'Cartão de Crédito',
                    'active' => true,
                    'installments' => 3
                ],
                'kind' => 'CreditCard',
                'label' => 'Cartão'
            ],
            'installments' => 3
        ]);
    }

    public function withMultipleItems(): static {
        return $this->state([
            'items' => [
                [
                    'product' => (string) new ObjectId('67226a404de3ba001afd7f4c'),
                    'name' => 'Combo delícia 1 - Big Filé',
                    'originalPrice' => 33.4,
                    'price' => 33.4,
                    'quantity' => 1,
                    'complements' => []
                ],
                [
                    'product' => (string) new ObjectId('67226a404de3ba001afd7f4d'),
                    'name' => 'Refrigerante',
                    'originalPrice' => 6.5,
                    'price' => 6.5,
                    'quantity' => 2,
                    'complements' => []
                ]
            ]
        ]);
    }
}