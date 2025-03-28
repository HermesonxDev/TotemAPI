<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'seq',
        'name',
        'company',
        'branch',
        'category',
        'description',
        'code',
        'barCode',
        'relatedPeriod',
        'slug',
        'active',
        'credit',
        'period',
        'complementsGroups',
        'sliderHeader',
        'locationTypes',
        'preparationTime',
        'staticImage',
        'stock',
        'costprice',
        'price'
    ];

    protected $casts = [
        'costprice' => 'float',
        'price' => 'float',
        'active' => 'boolean'
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
