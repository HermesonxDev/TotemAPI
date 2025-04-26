<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model {

    use HasFactory;
    
    protected $connection = 'mongodb';
    protected $collection = 'companies';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'name',
        'slug',
        'phone',
        'owner',
        'subgroups',
        'groups',
        'availableModes',
        'omnitricks',
        'prepaidEnabled',
        'driveThruEnabled',
        'allowAllBranchesView',
        'bannerHeader',
        'hideCategoriesMenu',
        'isFacebookLoginInactive',
        'isCompanyActive',
        'loyalty',
        'invoices',
        'branches',
        'employee',
        'locationTypes',
        'proximityRadiusTakeAway',
        'proximityRadiusTakeAwayActive',
        'settingsTotem',
        'settings',
        'noAuthOrder',
        '__v',
        'settingsOneSignal',
        'appUrl',
        'customMapsApiKeys',
        'iconMenu',
        'integrations',
        'marketplaceAccount',
        'minAppVersion',
        'layout',
        'newApi',
        'deliveryindoor',
        'blocksAndApartments',
        'deliveryindoorUserTypes',
        'faceRecognition',
        'deleted',
        'sellerSystem',
        'paymentLock',
    ];

    protected $casts = [
        'prepaidEnabled' => 'boolean',
        'driveThruEnabled' => 'boolean',
        'allowAllBranchesView' => 'boolean',
        'hideCategoriesMenu' => 'boolean',
        'isFacebookLoginInactive' => 'boolean',
        'isCompanyActive' => 'boolean',
        'proximityRadiusTakeAwayActive' => 'boolean',
        'noAuthOrder' => 'boolean',
        'newApi' => 'boolean'
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
