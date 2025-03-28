<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\User;

class TestController extends Controller
{
    public function test(Request $request) {

        $test = Branch::where('_id', '619cd958a2a74438918faa25')->first();

        return response()->json([$test]);
    }
}
