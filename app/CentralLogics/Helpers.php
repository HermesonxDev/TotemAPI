<?php
namespace App\CentralLogics;

class Helpers
{
    public static function error_processor($validator) {
        $err_keeper = [];
        foreach ($validator->errors()->getMessages() as $index => $error) {
            array_push($err_keeper, ['code' => $index, 'message' => $error[0]]);
        }
        return $err_keeper;
    }

    public static function error_formater($key, $mesage, $errors = []) {
        $errors[] = ['code' => $key, 'message' => $mesage];

        return $errors;
    }

    public static function hasAnyRole($userRoles, $allowedRoles) {
        return !empty(array_intersect($userRoles, $allowedRoles));
    }    
}
