<?php

use function Pest\Laravel\postJson;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Totemuser;

uses(Tests\TestCase::class)->group('auth_totem');

describe('successful tests', function () {

    it('should return 201 after logging with valid credentials', function () {

        $user = [
            'strategy'      => 'local',
            'userStrategy'  => 'totem',
            'username'      => 't01b02@klavi.app.br',
            'password'      => 'b02@bbl'
        ];

        $response = postJson('/api/test/auth/authentication', $user);
        
        $response->assertStatus(201)
                 ->assertJsonStructure([
                    'jwt',
                    'payload' => [
                        'type',
                        'iat',
                        'exp',
                        'companyId',
                        'branch',
                        'email',
                        'name',
                        'userId',
                        'aud',
                        'tefIpAddress',
                        'tefOtp',
                        'tefCompany',
                        'tefCNPJ',
                        'tefTerminal',
                        'tefComunicacao',
                        'tefInternalPrinter',
                        'fixedUserToken',
                        'iss'
                    ]
                ]);
    });
});

describe('validation tests', function () {

    dataset('requiredFields', [
        'The strategy field is required.'       => ['strategy'],
        'The user strategy field is required.'  => ['userStrategy'],
        'The username field is required.'       => ['username'],
        'The password field is required.'       => ['password']
    ]);

    it('should return 422 if required field is missing on login', function ($field) {

        $data = [
            'strategy'      => 'local',
            'userStrategy'  => 'totem',
            'username'      => 't01b02@klavi.app.br',
            'password'      => 'b02@bbl'
        ];

        unset($data[$field]);

        $response = postJson('/api/test/auth/authentication', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([$field]);

    })->with('requiredFields');


    dataset('invalidLoginFields', [
        'invalid strategy' => [
            [
                'strategy' => Str::random(10),
                'userStrategy' => 'totem',
                'username' => 't01b02@klavi.app.br',
                'password' => 'b02@bbl',
            ],
            'strategy',
            null
        ],
        'invalid userStrategy' => [
            [
                'strategy' => 'local',
                'userStrategy' => Str::random(10),
                'username' => 't01b02@klavi.app.br',
                'password' => 'b02@bbl',
            ],
            'userStrategy',
            null
        ],
        'invalid username' => [
            [
                'strategy' => 'local',
                'userStrategy' => 'totem',
                'username' => Str::random(10) . '@klavi.app.br',
                'password' => 'b02@bbl',
            ],
            null,
            'Usuário ou Senha Incorretos!'
        ],
        'invalid password' => [
            [
                'strategy' => 'local',
                'userStrategy' => 'totem',
                'username' => 't01b02@klavi.app.br',
                'password' => Str::random(10),
            ],
            null,
            'Usuário ou Senha Incorretos!'
        ]
    ]);    

    it('should return 422 when login with invalid field', function ($user, $field, $expectedMessage) {
        $response = postJson('/api/test/auth/authentication', $user);
    
        $response->assertStatus(422);
    
        if ($field) {
            $response->assertJsonValidationErrors([$field]);
        } elseif ($expectedMessage) {
            $response->assertJson([
                'errors' => $expectedMessage
            ]);
        }
    })->with('invalidLoginFields');    

});

describe('failed tests', function () {
    
});