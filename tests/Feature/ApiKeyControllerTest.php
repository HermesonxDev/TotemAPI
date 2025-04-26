<?php

use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;
use MongoDB\BSON\ObjectId;
use App\Models\Apikey;
use App\Models\Company;

uses(Tests\TestCase::class)->group('apikey');

describe('successful tests', function () {

    it('should return 201 when create api key', function () {
        $company = Company::factory()->create();
    
        $data = [
            'name'      => $company->name,
            'branch'    => (string) $company->branches[0],
            'company'   => $company->id
        ];
    
        $response = postJson('/api/test/create/apikey', $data);
    
        $response->assertStatus(201)
                 ->assertJson([
                    'message' => 'Chave de API criada com Sucesso!'
                 ]);
    
        $this->assertTrue(
            Apikey::where('name', $data['name'])
                  ->where('company', new ObjectId($data['company']))
                  ->where('branches', [new ObjectId($data['branch'])])
                  ->exists()
        );                
    });
    

    it('should return 200 when listing apikeys', function () {

        $response = getJson('/api/test/list/apikey');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'total',
                    'limit',
                    'skip',
                    'data' => [
                        '*' => [
                            '_id',
                            'updatedAt',
                            'createdAt',
                            'name',
                            'company',
                            'key',
                            'branches',
                            '__v'
                        ]
                    ]
                 ]);
        
        $this->assertIsArray($response['data']);
        $this->assertLessThanOrEqual(10, count($response['data']));
    });


    it('should return 200 when receiving the parameter $limit=false when listing api keys', function () {

        $response = getJson('/api/test/list/apikey?$limit={false}');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'total',
                    'limit',
                    'skip',
                    'data' => [
                        '*' => [
                            '_id',
                            'updatedAt',
                            'createdAt',
                            'name',
                            'company',
                            'key',
                            'branches',
                            '__v'
                        ]
                    ]
                 ]);

        $total = Apikey::count();

        $this->assertIsArray($response['data']);
        $this->assertLessThanOrEqual($total, count($response['data']));
    });


    it('should return 200 when receiving the $limit parameter with some numeric value when listing api keys', function () {

        $quantity = rand(1, 100);

        $response = getJson("/api/test/list/apikey?\$limit=$quantity");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'total',
                    'limit',
                    'skip',
                    'data' => [
                        '*' => [
                            '_id',
                            'updatedAt',
                            'createdAt',
                            'name',
                            'company',
                            'key',
                            'branches',
                            '__v'
                        ]
                    ]
                 ]);

        $this->assertIsArray($response['data']);
        $this->assertLessThanOrEqual($quantity, count($response['data']));
    });


    it('checks if the amount of data returned is equal to the value received in the $limit parameter', function () {

        $quantity = rand(1, 100);

        $response = getJson("/api/test/list/apikey?\$limit=$quantity");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'total',
                    'limit',
                    'skip',
                    'data' => [
                        '*' => [
                            '_id',
                            'updatedAt',
                            'createdAt',
                            'name',
                            'company',
                            'key',
                            'branches',
                            '__v'
                        ]
                    ]
                 ]);

        $this->assertIsArray($response['data']);
        $this->assertLessThanOrEqual($quantity, count($response['data']));
    });


    it('should return 200 if it finds api keys of the company received by parameter', function () {

        $company = Company::factory()->create();

        Apikey::factory(5)->create([
            'company' => new ObjectId($company->id)
        ]);

        $response = getJson("/api/test/list/apikey?company=$company->id");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    'total',
                    'limit',
                    'skip',
                    'data' => [
                        '*' => [
                            '_id',
                            'updatedAt',
                            'createdAt',
                            'name',
                            'company',
                            'key',
                            'branches',
                            '__v'
                        ]
                    ]
                ]);
        
        $this->assertIsArray($response['data']);
        $this->assertLessThanOrEqual(5, count($response['data']));
    });
});

describe('validation tests', function () {

    dataset('requiredFields', [
        'The name field is required.'     => ['name'],
        'The branch field is required.'   => ['branch'],
        'The company field is required.'  => ['company']
    ]);

    it('should return 422 if required field is missing on creation', function ($field) {

        $company = Company::factory()->create();

        $data = [
            'name'      => $company->name,
            'branch'    => (string) $company->branches[0],
            'company'   => $company->id
        ];

        unset($data[$field]);

        $response = postJson('/api/test/create/apikey', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([$field]);

    })->with('requiredFields');


    it('should return 404 if no api key is found for the company provided by parameter', function () {
        
        $company = Company::factory()->create();

        $response = getJson("/api/test/list/apikey?company=$company->id");

        $response->assertStatus(404)
                 ->assertJson([
                    'message' => 'Erro ao Listar Api Keys.',
                    'error' => 'Nenhuma API Key encontrada para essa Company.'
                 ]);
    });
});

describe('failed tests', function () {

});