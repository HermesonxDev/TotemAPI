<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class Branch extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'branches';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'name',
        'phone',
        'company',
        'barcodeReader',
        'facebook',
        'storeInfo',
        'gateways',
        'takeAway',
        'settingsTotem',
        'settingsWeb',
        'settingsApp',
        'serviceFee',
        'scheduling',
        'printHtml',
        'printers',
        'printerColumnSize',
        'preferredOnlineMethod',
        'paymentMethodsDefault',
        'paymentMethods',
        'opened',
        'normalizePrinting',
        'minPrice',
        'locationTypes',
        'location',
        'isOnlinePaymentDisabled',
        'isDeliveryOnMinPrice',
        'integrations',
        'deliveryDistricts',
        'copiesPrinting',
        'automaticPrinting',
        'active',
        '__v',
        'slug',
        'staticImage',
        'categoriesGroupsEnabled',
        'contactEmail',
        'mpToken',
        'blocksAndApartments',
        'whatsappPhone',
        'deliveryArea',
        'categoriesGroupsTitle',
        'preferredDeliverySystem',
        'deleted'
    ];

    protected $casts = [
        'barcodeReader' => 'boolean',
        'active' => 'boolean',
        'opened' => 'boolean',
        'normalizePrinting' => 'boolean',
        'isOnlinePaymentDisabled' => 'boolean',
        'isDeliveryOnMinPrice' => 'boolean',
        'printHtml' => 'boolean',
        'automaticPrinting' => 'boolean',
        'serviceFee' => 'float',
        'printerColumnSize' => 'integer',
        'copiesPrinting' => 'integer',
        'minPrice' => 'float'
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
