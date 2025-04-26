<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model {

    use HasFactory; 

    protected $connection = 'mongodb';
    protected $collection = 'orders';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'amount',
        'subtotal',
        'total',
        'branch',
        'inutriOrder',
        'inutriOrderDeliveryAddress',
        'coupon',
        'simpleAuth',
        'totemClientName',
        'cpfCustomer',
        'totemNF_email',
        'offers',
        'discount',
        'withdrawalTime',
        'appInfo',
        'deliveryTime',
        'additionalInfo',
        'installments',
        'originOrder',
        'company',
        'customer',
        'seq',
        'seqPanel',
        'stoneTotemPayment',
        'colmeiaOrders',
        'colmeiaItems',
        'change',
        'paymentMethod',
        'paid',
        'review',
        'earnedPoints',
        'serviceFee',
        'deliveryFee',
        'totemVersion',
        'gifts',
        'items',
        'history',
        'location',
        'locationType',
        'status',
        '__v',
        'createdAt',
        'updatedAt'
    ];

    protected $casts = [
        'paid' => 'boolean',
        'createdAt' => 'datetime',
        'updatedAt' => 'datetime'
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
