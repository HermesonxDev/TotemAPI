<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model {

    use HasFactory;
    
    protected $connection = 'mongodb';
    protected $collection = 'schedules';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'company',
        'branch',
        'maxTimeForSchedulingInHours',
        'minTimeForSchedulingInHours',
        'allowImmediateOrder',
        'locationTypes',
        'enabled',
        'periods',
        '__v'
    ];

    protected $casts = [
        'allowImmediateOrder' => 'boolean',
        'locationTypes' => 'array',
        'enabled' => 'boolean',
        'periods' => 'array'
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
