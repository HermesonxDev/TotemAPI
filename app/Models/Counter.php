<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Counter extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'counters';

    protected $fillable = [
        'id',
        'reference_value',
        'seq'
    ];
}
