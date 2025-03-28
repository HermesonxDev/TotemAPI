<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class Totemuser extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'totemuser';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'active',
        'customerOf',
        'branch',
        'company',
        'email',
        'name',
        'maxConcurrentLogins',
        'password',
        'isVerified',
        'iatVerify',
        '__v',
        'deleted',
        'fixedUserToken',
        'tefCNPJ',
        'tefCompany',
        'tefComunicacao',
        'tefIpAddress',
        'tefOtp',
        'tefTerminal',
        'testFlag',
    ];

    protected $casts = [
        'active' => 'boolean',
        'isVerified' => 'boolean',
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
