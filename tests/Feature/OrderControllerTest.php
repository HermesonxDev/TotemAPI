<?php

use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use MongoDB\BSON\ObjectId;
use App\Models\Order;

uses(Tests\TestCase::class)->group('order');

describe('successful tests', function () {

    describe('orders', function () {
        it('should return 200 when creating an order', function () {
        
            $order = Order::factory()->make()->toArray();

            $response = postJson('/api/test/create/order', $order);

            $response->assertStatus(200)
                     ->assertJson([
                        "message" => "Pedido Criado com Sucesso!"
                    ]);

            $this->assertTrue(
                Order::where("totemClientName", $order['totemClientName'])
                     ->where('total', $order['total'])
                     ->exists()
            );
        });
    
    
        it('should return 200 when get order details', function () {
    
            $order = Order::orderBy('createdAt', 'asc')->first();
            
            $response = getJson("/api/test/pdv/events/orders?id={$order->id}");
    
            $response->assertStatus(200)
                     ->assertJsonStructure([
                        'createdAt',
                        'updatedAt',
                        'id',
                        'seq',
                        'type',
                        'merchant' => [
                            'id',
                            'name',
                            'phones',
                            'address' => [
                                'formattedAddress',
                                'country',
                                'state',
                                'city',
                                'neighborhood',
                                'streetName',
                                'streetNumber',
                                'postalCode'
                            ]
                        ],
                        'additionalInfo',
                        'payment' => [
                            'kind',
                            'label',
                            'code'
                        ],
                        'pinpadResponse',
                        'customer' => [
                            'id',
                            'name',
                            'taxPayerIdentificationNumber',
                            'email',
                            'cpf'
                        ],
                        'items' => [
                            '*' => [
                                'reference',
                                'name',
                                'quantity',
                                'category_group',
                                'price',
                                'subItemsPrice',
                                'totalPrice',
                                'externalCode',
                                'observations',
                                'subItems' => [
                                    '*' => [
                                        'reference',
                                        'name',
                                        'quantity',
                                        'price',
                                        'totalPrice'
                                    ]
                                ]
                            ]
                        ],
                        'subTotal',
                        'deliveryFee',
                        'discount',
                        'totalPrice',
                        'changeFor',
                        'deliveryAddress' => [
                            'formattedAddress',
                            'country',
                            'state',
                            'city',
                            'coordinates' => [
                                'latitude',
                                'longitude',
                            ],
                            'neighborhood',
                            'streetName',
                            'streetNumber',
                            'postalCode',
                            'reference',
                            'complement'
                        ]
                     ]);
        });
    });


    describe('status change', function () {
        it('should return 200 when approved order', function () {

            $order = Order::where('status', 1)->first();
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/APPROVED");
    
            $response->assertStatus(200)
                     ->assertJson([
                        "message" => "Pedido Atualizado com Sucesso!"
                     ]);
        });
    
        
        it('should return 200 when refused order', function () {
    
            $order = Order::where('status', 1)->first();
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/REFUSED");
    
            $response->assertStatus(200)
                     ->assertJson([
                        "message" => "Pedido Atualizado com Sucesso!"
                     ]);
        });
    
    
        it('should return 200 when delivered order', function () {
    
            $order = Order::where('status', 4)->first();
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/DELIVERED");
    
            $response->assertStatus(200)
                     ->assertJson([
                        "message" => "Pedido Atualizado com Sucesso!"
                     ]);
        });
    
    
        it('should return 200 when cancelled order', function () {
    
            $order = Order::where('status', 4)->first();
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/CANCELLED");
    
            $response->assertStatus(200)
                     ->assertJson([
                        "message" => "Pedido Atualizado com Sucesso!"
                     ]);
        });
    });
});

describe('validation tests', function () {

    dataset('requiredFields', [
        'The amount field is required.'           => ['amount'],
        'The subtotal field is required.'         => ['subtotal'],
        'The total field is required.'            => ['total'],
        'The branch field is required.'           => ['branch'],
        'The change field is required.'           => ['change'],
        'The simpleAuth field is required.'       => ['simpleAuth'],
        'The deliveryFee field is required.'      => ['deliveryFee'],
        'The items field is required.'            => ['items'],
        'The totemVersion field is required.'     => ['totemVersion'],
        'The locationType field is required.'     => ['locationType'],
        'The paymentMethod field is required.'    => ['paymentMethod'],
        'The additionalInfo field is required.'   => ['additionalInfo'],
        'The installments field is required.'     => ['installments']
    ]);

    it('should return 422 if required field is missing on creation', function ($field) {

        $data = Order::factory()->make()->toArray();

        unset($data[$field]);

        $response = postJson('/api/test/create/order', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([$field]);

    })->with('requiredFields');


    describe("getting details of an order that doesn't exist", function () {
        it('should return 404 if order does not exist', function () {

            $orderId = new ObjectId();

            $response = getJson("/api/test/pdv/events/orders?id={$orderId}");

            $response->assertStatus(404)
                     ->assertJson([
                        "error" => "Pedido não encontrado"
                     ]);
        });
    });


    describe('status exchange with invalid values', function () {
        it('should return 400 if the status given to the order does not exist', function () {

            $order = Order::where('status', 1)->first();
            $newStatus = Str::random(10);
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/{$newStatus}");
    
            $response->assertStatus(400)
                     ->assertJson([
                        "message" => "Status inválido: " . strtoupper($newStatus)
                     ]);
        });

        it('should return 400 if the order with status PENDING APPROVAL is given a status other than APPROVED or REFUSED', function () {

            $order = Order::where('status', 1)->first();
    
            $statuses = [
                'PENDING_APPROVAL',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'CANCELLED',
                'REFUNDED',
                'AT_ESTABLISHMENT',
                'WAITING_FOR_FINISH',
                'FINISHED',
                'WAITING_FOR_DELIVERY'
            ];
    
            $translateStatus = [
                'PENDING_APPROVAL'     => 1,
                'OUT_FOR_DELIVERY'     => 4,
                'DELIVERED'            => 8,
                'CANCELLED'            => 16,
                'REFUNDED'             => 64,
                'AT_ESTABLISHMENT'     => 128,
                'WAITING_FOR_FINISH'   => 256,
                'FINISHED'             => 512,
                'WAITING_FOR_DELIVERY' => 1024,
            ];
    
            $status = $statuses[array_rand($statuses)];
            $statusTranslated = $translateStatus[$status];
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/{$status}");
    
            $response->assertStatus(400)
                     ->assertJson([
                        'message' => "Operação inválida: o pedido no status [1] não pode ser alterado para [$statusTranslated]"
                     ]);
        });
    
        it('should return 400 if the order with status OUT FOR DELIVERY is given a status other than DELIVERED or CANCELLED', function () {
    
            $order = Order::where('status', 4)->first();
    
            $statuses = [
                'PENDING_APPROVAL',
                'APPROVED',
                'OUT_FOR_DELIVERY',
                'REFUSED',
                'REFUNDED',
                'AT_ESTABLISHMENT',
                'WAITING_FOR_FINISH',
                'FINISHED',
                'WAITING_FOR_DELIVERY'
            ];
    
            $translateStatus = [
                'PENDING_APPROVAL'     => 1,
                'APPROVED'             => 2,
                'OUT_FOR_DELIVERY'     => 4,
                'REFUSED'              => 32,
                'REFUNDED'             => 64,
                'AT_ESTABLISHMENT'     => 128,
                'WAITING_FOR_FINISH'   => 256,
                'FINISHED'             => 512,
                'WAITING_FOR_DELIVERY' => 1024
            ];
    
            $status = $statuses[array_rand($statuses)];
            $statusTranslated = $translateStatus[$status];
    
            $response = postJson("/api/test/pdv/events/orders/{$order->id}/statuses/{$status}");
    
            $response->assertStatus(400)
                     ->assertJson([
                        'message' => "Operação inválida: o pedido no status [4] não pode ser alterado para [$statusTranslated]"
                     ]);
        });
    });


    describe('changing the status of an order that does not exist', function () {
        it('should return 404 if order does not exist', function () {

            $orderId = new ObjectId();
    
            $response = postJson("/api/test/pdv/events/orders/{$orderId}/statuses/APPROVED");
    
            $response->assertStatus(404)
                     ->assertJson([
                        'message' => 'Pedido não encontrado'
                     ]);
        });
    });
});

describe('failed tests', function () {

});