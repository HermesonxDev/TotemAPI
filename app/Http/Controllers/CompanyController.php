<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Company;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller {
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'active'                         => 'required',
            'name'                           => 'required|string',
            'slug'                           => 'required|string',
            'phone'                          => 'required|string',
            //'owner'                          => 'required|string',
            'prepaidEnabled'                 => 'required',
            'driveThruEnabled'               => 'required',
            'allowAllBranchesView'           => 'required',
            'bannerHeaderImages'             => 'nullable|array',
            'bannerHeaderImages.*'           => 'file|mimes:jpeg,png,jpg',
            'hideCategoriesMenu'             => 'required',
            'isFacebookLoginInactive'        => 'required',
            'proximityRadiusTakeAwayActive'  => 'required',
            'proximityRadiusTakeAway'        => 'nullable|string',
            'settingsTotemPaymentLock'       => 'required',
            'settingsTotemPrimaryColor'      => 'required|string',
            'settingsTotemSecundaryColor'    => 'required|string',
            'settingsTotemlayout'            => 'required|string',
            'settingsScreenTotemOrientation' => 'required|string',
            'columns'                        => 'required|string',
            'customerNameFormat'             => 'required|string',
            'consumeTypeBackground'          => 'nullable|array',
            'consumeTypeBackground.*'        => 'file|mimes:jpeg,png,jpg',
            'selectPaymentBackground'        => 'nullable|array',
            'selectPaymentBackground.*'      => 'file|mimes:jpeg,png,jpg',
            'allowPrinting'                  => 'required',
            'membershipMode'                 => 'required',
            'screenOrientation'              => 'required|string',
            'modalFontColor'                 => 'required|string',
            'selectedMenuFontColor'          => 'required|string',
            'paperSize'                      => 'required|string',
            'printNote'                      => 'required|string',
            'moneyPaymentText'               => 'required|string',
            'whatsAppButton'                 => 'required',
            'whatsAppNumber'                 => 'required|string',
            'whatsAppVerifier'               => 'required',
            'defaultWhatsAppMessage'         => 'required|string',
            'signUpCardRequired'             => 'required',
            'currency'                       => 'required|string',
            'ourStoresText'                  => 'nullable|string',
            'driveThruInfo'                  => 'nullable|string',
            'onStoreText'                    => 'nullable|string',
            'toGoText'                       => 'nullable|string',
            'deliveryText'                   => 'nullable|string',
            'settingsPrimaryColor'           => 'required|string',
            'settingsSecundaryColor'         => 'required|string',
            'icon512'                        => 'nullable|array',
            'icon512.*'                      => 'file|mimes:jpeg,png,jpg',
            'headerLogo'                     => 'nullable|array',
            'headerLogo.*'                   => 'file|mimes:jpeg,png,jpg',
            'favicon'                        => 'nullable|array',
            'favicon.*'                      => 'file|mimes:jpeg,png,jpg',
            'noAuthOrder'                    => 'required',
            'oneSignalAppId'                 => 'nullable|string',
            'oneSignalRestApiKey'            => 'nullable|string',
            'appUrl'                         => 'nullable|string',
            'layout'                         => 'required|string',
            'deliveryIndoor'                 => 'required',
            'deliveryIndoorType'             => 'nullable|string',
            'faceRecognition'                => 'required',
            'sellerSystem'                   => 'required',
            'paymentLock'                    => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company = new Company();

        $company->name = $request->name;
        $company->slug = $request->slug;
        $company->phone = $request->phone;
        $company->subgroups = [];
        $company->groups = [];
        $company->availableModes = [
            "education" => false,
            "omnibox" => false,
            "supermenu" => true
        ];
        $company->omnitricks = [
            "hideBypassShowProducts" => true
        ];
        $company->prepaidEnabled = filter_var($request->prepaidEnabled, FILTER_VALIDATE_BOOLEAN);
        $company->driveThruEnabled = filter_var($request->driveThruEnabled, FILTER_VALIDATE_BOOLEAN);
        $company->allowAllBranchesView = filter_var($request->allowAllBranchesView, FILTER_VALIDATE_BOOLEAN);
        $company->bannerHeader = [
            "slideImageEnabled" => true,
                "image" => [],
                "video" => [
                    "enabled" => false,
                    "loop" => false,
                    "playing" => true
                ],
                "preferredType" => "Foto",
                "slideImageSpeed" => 29631
        ];

        $bannerHeader = json_decode(json_encode($company->bannerHeader), true);

        if ($request->hasFile('bannerHeaderImages')) {
            $newImages = [];

            foreach ($request->file('bannerHeaderImages') as $image) {
                $path = Storage::disk('s3')->put("bannerHeaderImages/" . $request->slug, $image);
                $newImages[] = env('AWS_URL') . "/" . $path;
            }

            $bannerHeader["image"] = array_map(fn($url) => [
                'photo' => $url,
                'preferredType' => "photo",
                '_id' => (string) new ObjectId(),
                'active' => true,
            ], $newImages);
        }

        $company->bannerHeader = $bannerHeader;

        $company->hideCategoriesMenu = filter_var($request->hideCategoriesMenu, FILTER_VALIDATE_BOOLEAN);
        $company->isFacebookLoginInactive = filter_var($request->isFacebookLoginInactive, FILTER_VALIDATE_BOOLEAN);
        $company->isCompanyActive = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
        $company->loyalty = [
            "points" => [
                "disabled" => false,
                "rate" => 1
            ]
        ];
        $company->invoices = [];
        $company->branches = [];
        $company->employee = [];
        $company->locationTypes = [
            1,
            2,
            4,
            8
        ];
        $company->proximityRadiusTakeAway = (integer) $request->proximityRadiusTakeAway;
        $company->proximityRadiusTakeAwayActive = filter_var($request->proximityRadiusTakeAwayActive, FILTER_VALIDATE_BOOLEAN);
        $company->settingsTotem = [
            "paymentLock" => $request->settingsTotemPaymentLock,
            "primaryColor" => $request->settingsTotemPrimaryColor,
            "secundaryColor" => $request->settingsTotemSecundaryColor,
            "layout" => $request->settingsTotemlayout,
            "columns" => $request->columns,
            "customerNameFormat" => (integer) $request->customerNameFormat,
            "consumeTypeBackground" => "",
            "selectPaymentBackground" => "",
            "consumeTypes" => [
                [
                    "icon" => "",
                    "text" => "",
                    "active" => false,
                    "value" => 1,
                    "_id" => new ObjectId()
                ],
                [
                    "icon" => "",
                    "text" => "",
                    "active" => true,
                    "value" => 2,
                    "_id" => new ObjectId()
                ]
            ],
            "imageSize" => "cover",
            "allowPrinting" => filter_var($request->allowPrinting, FILTER_VALIDATE_BOOLEAN),
            "modalFontColor" => $request->modalFontColor,
            "waitingBgColor" => "",
            "paperSize" => $request->paperSize,
            "printNote" => $request->printNote,
            "screenOrientation" => $request->settingsScreenTotemOrientation,
            "moneyPaymentText" => $request->moneyPaymentText,
            "membershipMode" => filter_var($request->membershipMode, FILTER_VALIDATE_BOOLEAN),
            "printerId" => 0,
            "selectedMenuFontColor" => $request->selectedMenuFontColor
        ];

        $settingsTotem = json_decode(json_encode($company->settingsTotem), true);

        if ($request->hasFile('consumeTypeBackground')) {
            $newImages = [];

            foreach ($request->file('consumeTypeBackground') as $image) {
                $path = Storage::disk('s3')->put("consumeTypeBackground", $image);
                $newImages[] = env('AWS_URL') . "/" . $path;
            }

            $settingsTotem["consumeTypeBackground"] = $newImages[0] ?? null;
        }

        $company->settingsTotem = $settingsTotem;

        $settingsTotem = json_decode(json_encode($company->settingsTotem), true);

        if ($request->hasFile('selectPaymentBackground')) {
            $newImages = [];

            foreach ($request->file('selectPaymentBackground') as $image) {
                $path = Storage::disk('s3')->put("selectPaymentBackground", $image);
                $newImages[] = env('AWS_URL') . "/" . $path;
            }

            $settingsTotem["selectPaymentBackground"] = $newImages[0] ?? null;
        }

        $company->settingsTotem = $settingsTotem;

        $company->settings = [
            "whatsAppInstance" => "",
            "whatsAppButton" => filter_var($request->whatsAppButton, FILTER_VALIDATE_BOOLEAN),
            "whatsAppNumber" => $request->whatsAppNumber,
            "whatsAppVerifier" => filter_var($request->whatsAppVerifier, FILTER_VALIDATE_BOOLEAN),
            "defaultWhatsAppMessage" => $request->defaultWhatsAppMessage,
            "signUpCardRequired" => filter_var($request->signUpCardRequired, FILTER_VALIDATE_BOOLEAN),
            "currency" => $request->currency,
            "ourStoresText" => $request->ourStoresText,
            "driveThruInfo" => $request->driveThruInfo,
            "driveThruText" => "Drive-thru",
            "onStoreText" => $request->onStoreText,
            "toGoText" => $request->toGoText,
            "deliveryText" => $request->deliveryText,
            "primaryColor" => $request->settingsPrimaryColor,
            "secundaryColor" => $request->settingsSecundaryColor,
            "icon512" => "",
            "headerLogo" => "",
            "favicon" => "",
            "screenOrientation" => $request->screenOrientation,
            "paymentLock" => filter_var($request->paymentLock, FILTER_VALIDATE_BOOLEAN),
            "membershipMode" => filter_var($request->membershipMode, FILTER_VALIDATE_BOOLEAN),
        ];

        $settings = json_decode(json_encode($company->settings), true);

        if ($request->hasFile('icon512')) {
            $newImages = [];

            foreach ($request->file('icon512') as $image) {
                $path = Storage::disk('s3')->put("icon512", $image);
                $newImages[] = env('AWS_URL') . "/" . $path;
            }

            $settings["icon512"] = $newImages[0] ?? null;
        }

        $company->settings = $settings;

        $settings = json_decode(json_encode($company->settings), true);

        if ($request->hasFile('headerLogo')) {
            $newImages = [];

            foreach ($request->file('headerLogo') as $image) {
                $path = Storage::disk('s3')->put("headerLogo", $image);
                $newImages[] = env('AWS_URL') . "/" . $path;
            }

            $settings["headerLogo"] = $newImages[0] ?? null;
        }

        $company->settings = $settings;

        $settings = json_decode(json_encode($company->settings), true);

        if ($request->hasFile('favicon')) {
            $newImages = [];

            foreach ($request->file('favicon') as $image) {
                $path = Storage::disk('s3')->put("favicon", $image);
                $newImages[] = env('AWS_URL') . "/" . $path;
            }

            $settings["favicon"] = $newImages[0] ?? null;
        }

        $company->settings = $settings;

        $company->noAuthOrder = filter_var($request->noAuthOrder, FILTER_VALIDATE_BOOLEAN);
        $company->__v = 0;
        $company->settingsOneSignal = [
            "appId" => $request->oneSignalAppId,
            "restApiKey" => $request->oneSignalRestApiKey
        ];
        $company->appUrl = $request->appUrl;
        $company->customMapsApiKeys = [];
        $company->iconMenu = "material-local_mall";
        $company->integrations = [];
        $company->marketplaceAccount = [];
        $company->minAppVersion = [
            "mobile" => "1.0.0"
        ];
        $company->layout = $request->layout;
        $company->newApi = false;
        $company->deliveryindoor = filter_var($request->deliveryIndoor, FILTER_VALIDATE_BOOLEAN);
        $company->blocksAndApartment = [];
        $company->deliveryindoorUserType = [
            [
                "slug" => strtolower($request->deliveryIndoorType),
                "title" => $request->deliveryIndoorType
            ],
            [
                "slug" => "proprietario",
                "title" => "Proprietario"
            ]
        ];
        $company->faceRecognition = filter_var($request->faceRecognition, FILTER_VALIDATE_BOOLEAN);
        $company->deleted = false;
        $company->sellerSystem = filter_var($request->sellerSystem, FILTER_VALIDATE_BOOLEAN);
        $company->paymentLock = filter_var($request->paymentLock, FILTER_VALIDATE_BOOLEAN);

        $company->save();

        return response()->json($company, 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function companies(Request $request) {
        $id = $request->query('_id');
        $limit = $request->query('$limit', null);

        $query = Company::query();

        if ($id) {
            try {
                $query->where('_id', $id);
            } catch (\Exception $e) {
                return response()->json(['error' => 'ID inválido'], 400);
            }
        }

        if ($limit === "false" || is_null($limit)) {
            $limitValue = null;
        } elseif (is_numeric($limit)) {
            $limitValue = (int) $limit;
        } else {
            $limitValue = null;
        }

        if (!is_null($limitValue)) {
            $query->limit($limitValue);
        }

        $companies = $query->get()->map(function ($company) {
            return [
                '_id' => (string) $company->_id,
                'updatedAt' => $company->updatedAt,
                'createdAt' => $company->createdAt,
                'name' => $company->name,
                'slug' => $company->slug,
                'phone' => $company->phone,
                'owner' => (string) $company->owner,
                'subgroups' => $company->subgroups,
                'groups' => $company->groups,
                'availableModes' => $company->availableModes,
                'omnitricks' => $company->omnitricks,
                'prepaidEnabled' => $company->prepaidEnabled,
                'driveThruEnabled' => $company->driveThruEnabled,
                'allowAllBranchesView' => $company->allowAllBranchesView,
                'bannerHeader' => [
                    'slideImageSpeed' => $company->bannerHeader['slideImageSpeed'] ?? 0,
                    'slideImageEnabled' => $company->bannerHeader['slideImageEnabled'] ?? false,
                    'image' => array_map(function ($image) {
                        return [
                            'active' => $image['active'],
                            '_id' => (string) $image['id'],
                            'photo' => $image['photo']
                        ];
                    }, $company->bannerHeader['image'] ?? []),
                ],
                'hideCategoriesMenu' => $company->hideCategoriesMenu,
                'isFacebookLoginInactive' => $company->isFacebookLoginInactive,
                'isCompanyActive' => $company->isCompanyActive,
                'loyalty' => $company->loyalty,
                'invoices' => $company->invoices,
                'branches' => array_map(fn($branch) => (string) $branch, $company->branches),
                'locationTypes' => $company->locationTypes,
                'proximityRadiusTakeAway' => $company->proximityRadiusTakeAway,
                'proximityRadiusTakeAwayActive' => $company->proximityRadiusTakeAwayActive,
                'settingsTotem' => [
                    'printerId' => $company->settingsTotem['printerId'] ?? 0,
                    'primaryColor' => $company->settingsTotem['primaryColor'] ?? "",
                    'secundaryColor' => $company->settingsTotem['secundaryColor'] ?? "",
                    'layout' => $company->settingsTotem['layout'] ?? "",
                    'columns' => $company->settingsTotem['columns'] ?? "",
                    'customerNameFormat' => $company->settingsTotem['customerNameFormat'] ?? 0,
                    'consumeTypeBackground' => $company->settingsTotem['consumeTypeBackground'] ?? "",
                    'selectPaymentBackground' => $company->settingsTotem['selectPaymentBackground'] ?? "",
                    'consumeTypes' => array_map(function ($consumeType) {
                        return [
                                "_id" => (string) $consumeType['id'] ?? "",
                                "value" => $consumeType['value'] ?? 0,
                                "active" => $consumeType['active'] ?? false,
                                "text" => $consumeType['text'] ?? "",
                                "icon" => $consumeType['icon'] ?? ""
                            ];
                        }, $company->settingsTotem['consumeTypes']) ?? [],
                    'imageSize' => $company->settingsTotem['imageSize'] ?? "",
                    'allowPrinting' => $company->settingsTotem['allowPrinting'] ?? false,
                    'screenOrientation' => $company->settingsTotem['screenOrientation'] ?? "",
                    'modalFontColor' => $company->settingsTotem['modalFontColor'] ?? "",
                    'waitingBgColor' => $company->settingsTotem['waitingBgColor'] ?? "",
                    'moneyPaymentText' => $company->settingsTotem['moneyPaymentText'] ?? "",
                    'paperSize' => $company->settingsTotem['paperSize'] ?? "",
                    'printNote' => $company->settingsTotem['printNote'] ?? ""
                ],
                'settings' => $company->settings,
                'blocksAndApartments' => $company->blocksAndApartments,
                'deliveryindoorUserTypes' => $company->deliveryindoorUserTypes,
                'faceRecognition' => $company->faceRecognition,
                'noAuthOrder' => $company->noAuthOrder,
                '__v' => $company->__v,
                'layout' => $company->layout,
                'iconMenu' => $company->iconMenu,
                'appUrl' => $company->appUrl,
                'customMapsApiKeys' => $company->customMapsApiKeys,
                'integrations' => $company->integrations,
                'marketplaceAccount' => $company->marketplaceAccount,
                'minAppVersion' => $company->minAppVersion,
                'settingsOneSignal' => $company->settingsOneSignal
            ];
        });

        return response()->json([
            'total' => count($companies),
            'limit' => $limitValue,
            'skip' => 0,
            'data' => $companies
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }
}
