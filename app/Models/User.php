<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Eloquent\Model;
use Carbon\Carbon;

class User extends Model implements AuthenticatableContract
{
    use Authenticatable, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'active',
        'name',
        'password',
        'cpf',
        'phone',
        'birthDate',
        'gender',
        'email',
        'customerOf',
        'noAuthUser',
        'children',
        'grouping',
        'credit',
        'isVerified',
        'branches',
        'roles',
        'addresses',
        'mp',
        'payment_method',
        'loyalty',
        '__v',
        'cnpj',
        'company',
        'externalId',
        'pushToken',
        'pagarme',
        'azureFacePersonId',
        'azurePhotoSent',
        'superuser',
        'deleted',
        'resetExpires',
        'resetShortToken',
        'resetToken',
        'photo'
    ];

    protected $casts = [
        'noAuthUser' => 'boolean',
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
