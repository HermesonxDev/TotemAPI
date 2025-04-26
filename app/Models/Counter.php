<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Counter extends Model {

    use HasFactory;
    
    protected $connection = 'mongodb';
    protected $collection = 'counters';

    protected $fillable = [
        'id',
        'reference_value',
        'seq'
    ];
}
