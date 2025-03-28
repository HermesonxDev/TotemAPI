<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class Period extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'periods';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'title',
        'branch',
        'company',
        'period',
        '__v'
    ];

    public $timestamps = true;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->createdAt = Carbon::now('America/Fortaleza')->format('Y-m-d\TH:i:s.u') . "Z";
            $model->updatedAt = Carbon::now('America/Fortaleza')->format('Y-m-d\TH:i:s.u') . "Z";
        });

        static::updating(function ($model) {
            $model->updatedAt = Carbon::now('America/Fortaleza')->format('Y-m-d\TH:i:s.u') . "Z";
        });
    }
}
