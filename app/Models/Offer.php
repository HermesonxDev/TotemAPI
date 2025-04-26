<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Offer extends Model {

    use HasFactory;
    
    protected $connection = 'mongodb';
    protected $collection = 'offers';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'branch',
        'title',
        'description',
        'imageLink',
        'company',
        'uses',
        'period',
        'triggers',
        'rules',
        'match',
        'rewards',
        'locationTypes',
        'disabled',
        '__v',
        'deleted'
    ];

    protected $casts = [
        'disabled' => 'boolean',
        'deleted' => 'boolean'
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
