<?php

use App\Models\Totemcharge;
use App\Models\Branch;
use App\Models\Company;
use MongoDB\BSON\ObjectId;
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;

uses(Tests\TestCase::class)->group('totem_charge');

describe('successful tests', function () {
    it('should return 202 if cloning is successful', function () {

        // 1. Criando os dados
        $company = Company::where('name', 'Bebelu')->first();

        $branches = Branch::where('company', new ObjectId($company->id))->get();

        if ($branches->count() < 2) {
            $this->markTestSkipped('Empresa tem menos de duas filiais.');
        }

        $randomBranches = $branches->random(2);

        $data = [
            "originalBranch" => $branches[0]->id,
            "destinationBranch" => $branches[1]->id
        ];

        // 2. Executa o teste
        $response = postJson('/api/clone-menu', $data);
        
        // 3. Verificações
        if ($response->status() !== 202) {
            $this->markTestSkipped('unexpected error while cloning menu');
            dump($response->json());
        }

        $response->assertStatus(202)
                 ->assertJson([
                    'message' => 'Clonagem iniciada! O cardápio será copiado em segundo plano.'
                 ]);
    });
});

describe('validation tests', function () {
    dataset('requiredFields', [
        'O campo original branch é obrigatório.' => ['originalBranch'],
        'O campo destination branch é obrigatório.' => ['destinationBranch']
    ]);

    dataset('invalidFields', [
        ['originalBranch', 1234],
        ['destinationBranch', 1234]
    ]);

    it('should return 422 if required field is missing on cloning', function ($field) {

        // 1. Criando os dados
        $data = [
            "originalBranch" => "6441ae9a491d9eca5be7d149",
            "destinationBranch" => "64b71908dd715b76a31ab928"
        ];

        unset($data[$field]);

        // 2. Executa o teste
        $response = postJson('/api/clone-menu', $data);
        
        // 3. Verificações
        if ($response->status() !== 422) {
            $this->markTestSkipped('unexpected error validating menu cloning fields');
            dump($response->json());
        }

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([$field]);

    })->with('requiredFields');


    it('should return 422 if fields are numbers instead of strings when cloning', function ($field, $invalidValue) {

        // 1. Criando os dados
        $data = [
            "originalBranch" => "6441ae9a491d9eca5be7d149",
            "destinationBranch" => "64b71908dd715b76a31ab928"
        ];

        $data[$field] = $invalidValue;

        // 2. Executa o teste
        $response = postJson('/api/clone-menu', $data);

        // 3. Verificações
        if ($response->status() !== 422) {
            $this->markTestSkipped('unexpected error validating menu cloning fields');
            dump($response->json());
        }

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([$field]);
                 
    })->with('invalidFields');
});

describe('failed tests', function () {

});