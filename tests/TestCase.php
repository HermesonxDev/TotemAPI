<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase {
    protected function setUp(): void {
        $dangerousDatabases = ['klavi', 'klavi_prod', 'prod_real'];

        if (in_array(env('DB_DATABASE'), $dangerousDatabases)) {
            throw new \Exception('🚫 Testes não podem rodar no banco real: ' . env('DB_DATABASE'));
        }

        parent::setUp();
    }
}
