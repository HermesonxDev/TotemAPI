<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class TotemActivity extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'totemactivities';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'branch',
        'company',
        'actionType',
        'totemMessage',
        'activities',
        '__v'
    ];

    protected $casts = [
        'activities' => 'array'
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
