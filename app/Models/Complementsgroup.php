<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Complementsgroup extends Model {

    use HasFactory;
    
    protected $connection = 'mongodb';
    protected $collection = 'complementsgroups';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'active',
        'seq',
        'title',
        'description',
        'categories',
        'branch',
        'company',
        'code',
        'ingredients',
        'rules',
        'locationTypes',
        'items',
        '__v',
        'deleted',
        'original_cloned_id',
        'settingsTotem'
    ];

    protected $casts = [
        'ingredients' => 'boolean'
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
