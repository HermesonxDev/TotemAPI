<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Productcategory extends Model {

    use HasFactory;
    
    protected $connection = 'mongodb';
    protected $collection = 'productcategories';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'seq',
        'name',
        'description',
        'branch',
        'slug',
        'categoryGroup',
        'staticImage',
        'staticImageTotem',
        'company',
        'integrationReference',
        'ingredients',
        'products',
        'disabled',
        'locationTypes',
        '__v',
        'deleted',
        'klaviPaymentRequired',
        'original_cloned_id'
    ];

    protected $casts = [
        'ingredients' => 'boolean',
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
