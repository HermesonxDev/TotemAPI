<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Branch;
use App\Models\Apikey;
use Firebase\JWT\JWT;
use Carbon\Carbon;

class BranchController extends Controller {

    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'active'                           => 'required',
            'name'                             => 'required|string',
            'slug'                             => 'required|string',
            'phone'                            => 'required|string',
            'whatsappPhone'                    => 'nullable|string',
            'email'                            => 'nullable|string',
            'franchise'                        => 'required|string',
            'street'                           => 'nullable|string',
            'neighborhood'                     => 'nullable|string',
            'complement'                       => 'nullable|string',
            'number'                           => 'nullable|string',
            'cep'                              => 'nullable|string',
            'city'                             => 'nullable|string',
            'state'                            => 'nullable|string',
            'latitude'                         => 'nullable|string',
            'longitude'                        => 'nullable|string',
            'storeInfo'                        => 'nullable|string',
            'adminPassword'                    => 'nullable|string',
            'serialNumber'                     => 'nullable|string',
            'controllerID'                     => 'nullable|string',
            'plugPagActivationKey'             => 'nullable|string',
            'openFreezerBtn'                   => 'required',
            'activeMicroMarket'                => 'required',
            'askForClientCPF'                  => 'required',
            'askForClientPassword'             => 'required',
            'askForClientPhone'                => 'required',
            'allowPrinting'                    => 'required',
            'paymentLock'                      => 'required',
            'memberShipMode'                   => 'required',
            'allowDelivery'                    => 'required',
            'whatsappBtn'                      => 'required',
            'isOnlinePaymentDisabled'          => 'required',
            'whatsappMessage'                  => 'nullable|string',
            'splashTotemImages'                => 'nullable|array',
            'splashTotemImages.*'              => 'file|mimes:jpeg,png,jpg',
            'bannerHeaderTotemImages'          => 'nullable|array',
            'bannerHeaderTotemImages.*'        => 'file|mimes:jpeg,png,jpg',
            'bannerHeaderWebImages'            => 'nullable|array',
            'bannerHeaderWebImages.*'          => 'file|mimes:jpeg,png,jpg',
            'bannerHeaderAppImages'            => 'nullable|array',
            'bannerHeaderAppImages.*'          => 'file|mimes:jpeg,png,jpg',
            'automaticPrinting'                => 'required',
            'normalizePrinting'                => 'required',
            'htmlPrinting'                     => 'required',
            'quantityPrintingCopies'           => 'nullable|string',
            'quantityPrintingColumns'          => 'nullable|string',
            'serviceFee'                       => 'nullable|string',
            'minPrice'                         => 'nullable|string',
            'useMinPriceOnDelivery'            => 'required',
            'schedulingOrders'                 => 'required',
            'minQuantitySO'                    => 'nullable|string',
            'maxQuantitySO'                    => 'nullable|string',
            'takeAwayOrders'                   => 'required',
            'minQuantityTAO'                   => 'nullable|string',
            'maxQuantityTAO'                   => 'nullable|string',
            'money'                            => 'required',
            'online'                           => 'required',
            'pix'                              => 'required',
            'pixDestinatary'                   => 'nullable|string',
            'pixKey'                           => 'nullable|string',
            'pixType'                          => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $branch = new Branch();
            $branch->name = $request->name;
            $branch->phone = $request->phone;
            $branch->company = new ObjectId($request->franchise);
            $branch->barcodeReader = false;
            $branch->facebook = [
                "pixel" => ""
            ];
            $branch->storeInfo = $request->storeInfo;
            $branch->takeAway = [
                "active" => filter_var($request->takeAwayOrders, FILTER_VALIDATE_BOOLEAN),
                "min" => (integer) $request->minQuantityTAO,
                "max" => (integer) $request->maxQuantityTAO
            ];
            $branch->settingsTotem = [
                "pix" => [
                    "type" => $request->pixType
                ],
                "totemOpenFreezerBtn" => filter_var($request->openFreezerBtn, FILTER_VALIDATE_BOOLEAN),
                "splash" => [
                    "slideImageEnabled" => true,
                    "image" => [],
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 3160
                ],
                "bannerHeader" => [
                    "slideImageEnabled" => true,
                    "image" => [],
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 7980
                ],
                "allowPrinting" => filter_var($request->allowPrinting, FILTER_VALIDATE_BOOLEAN),
                "enableMicroMarket" => filter_var($request->activeMicroMarket, FILTER_VALIDATE_BOOLEAN),
                "controllerId" => $request->controllerID,
                "totemAdminPassword" => [
                    "password" => $request->adminPassword,
                    "createdAt" => Carbon::now()->toIso8601String(),
                    "expirationDate" => Carbon::now()->addMinutes(10)->toIso8601String(),
                    "expirationInMinutes" => 10
                ],
                "askforCPF" => filter_var($request->askForClientCPF, FILTER_VALIDATE_BOOLEAN),
                "askforClientsPassword" => filter_var($request->askForClientPassword, FILTER_VALIDATE_BOOLEAN),
                "lastProductUpdate" => Carbon::now()->toIso8601String(),
                "paymentLock" => filter_var($request->paymentLock, FILTER_VALIDATE_BOOLEAN),
                "membershipMode" => filter_var($request->memberShipMode, FILTER_VALIDATE_BOOLEAN),
                "allowDelivery" => filter_var($request->allowDelivery, FILTER_VALIDATE_BOOLEAN),
                "totemSerialNumber" => $request->serialNumber,
                "plugPagActivationKey" => $request->plugPagActivationKey,
                "askforPhone" => filter_var($request->askForClientPhone, FILTER_VALIDATE_BOOLEAN),
                "askforPhoneIsMandatory" => false
            ];

            $settingsTotem = json_decode(json_encode($branch->settingsTotem), true);

            if ($request->hasFile('splashTotemImages')) {
                $newImages = [];

                foreach ($request->file('splashTotemImages') as $image) {
                    $path = Storage::disk('s3')->put("settingsTotemSplashImages/" . $request->slug, $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $settingsTotem["splash"]["image"] = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $newImages);
            }

            if ($request->hasFile('bannerHeaderTotemImages')) {
                $newImages = [];

                foreach ($request->file('bannerHeaderTotemImages') as $image) {
                    $path = Storage::disk('s3')->put("bannerHeaderTotemImages/" . $request->slug, $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $settingsTotem["bannerHeader"]["image"] = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $newImages);
            }

            $branch->settingsTotem = $settingsTotem;

            $branch->settingsWeb = [
                "bannerHeader" => [
                    "slideImageEnabled" => true,
                    "image" => [],
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 29631
                ]
            ];

            $settingsWeb = json_decode(json_encode($branch->settingsWeb), true);

            if ($request->hasFile('bannerHeaderWebImages')) {
                $newImages = [];

                foreach ($request->file('bannerHeaderWebImages') as $image) {
                    $path = Storage::disk('s3')->put("bannerHeaderWebImages/" . $request->slug, $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $settingsWeb["bannerHeader"]["image"] = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $newImages);
            }

            $branch->settingsWeb = $settingsWeb;

            $branch->settingsApp = [
                "whatsAppButton" => filter_var($request->whatsappBtn, FILTER_VALIDATE_BOOLEAN),
                "whatsAppNumber" => $request->whatsappPhone,
                "defaultWhatsAppMessage" => $request->whatsappMessage,
                "bannerHeader" => [
                    "slideImageEnabled" => true,
                    "image" => [],
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 29631
                ]
            ];

            $settingsApp = json_decode(json_encode($branch->settingsApp), true);

            if ($request->hasFile('bannerHeaderAppImages')) {
                $newImages = [];

                foreach ($request->file('bannerHeaderAppImages') as $image) {
                    $path = Storage::disk('s3')->put("bannerHeaderAppImages/" . $request->slug, $image);
                    $newImages[] = env('AWS_URL') . "/" . $path;
                }

                $settingsApp["bannerHeader"]["image"] = array_map(fn($url) => [
                    'photo' => $url,
                    'preferredType' => "photo",
                    '_id' => (string) new ObjectId(),
                    'active' => true,
                ], $newImages);
            }

            $branch->settingsApp = $settingsApp;

            $branch->serviceFee = (float) $request->serviceFee;
            $branch->scheduling = [
                "active" => filter_var($request->schedulingOrders, FILTER_VALIDATE_BOOLEAN),
                "min" => (integer) $request->minQuantitySO,
                "max" => (integer) $request->maxQuantitySO
            ];
            $branch->printHtml = filter_var($request->htmlPrinting, FILTER_VALIDATE_BOOLEAN);
            $branch->printerColumnSize = (integer) $request->quantityPrintingColumns;
            $branch->preferredOnlineMethod = "Pagarme";
            $branch->paymentMethodsDefault = [
                "pix" => [
                    "receiverName" => $request->pixDestinatary,
                    "key" => $request->pixKey,
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => filter_var($request->pix, FILTER_VALIDATE_BOOLEAN),
                    "type" => $request->pixType,
                    "name" => "Pix"
                ],

                "iZettle" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "code" => "",
                    "name" => "iZettle"
                ],

                "online" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => filter_var($request->online, FILTER_VALIDATE_BOOLEAN),
                    "name" => "Online"
                ],

                "money" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => filter_var($request->money, FILTER_VALIDATE_BOOLEAN),
                    "name" => "Dinheiro"
                ],

                "credits" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "name" => "Créditos"
                ],

                "sodexo" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "name" => "Sodexo"
                ],

                "stone" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "name" => "Stone"
                ]
            ];

            $branch->opened = false;
            $branch->normalizePrinting = filter_var($request->normalizePrinting, FILTER_VALIDATE_BOOLEAN);
            $branch->minPrice = (float) $request->minPrice;
            $branch->locationTypes = [
                1,
                2,
                4,
                8
            ];
            $branch->location = [
                "type" => "Point",
                "coordinates" => [
                    "latitude" => $request->latitude,
                    "longitude" => $request->longitude,
                ],
                "address" => [
                    "postalCode" => $request->cep,
                    "street" => $request->street,
                    "number" => $request->number,
                    "neighborhood" => $request->neighborhood,
                    "city" => $request->city,
                    "state" => $request->state,
                    "complement" => $request->complement
                ]
            ];
            $branch->isOnlinePaymentDisabled = filter_var($request->isOnlinePaymentDisabled, FILTER_VALIDATE_BOOLEAN);
            $branch->isDeliveryOnMinPrice = filter_var($request->useMinPriceOnDelivery, FILTER_VALIDATE_BOOLEAN);
            $branch->copiesPrinting = (integer) $request->quantityPrintingCopies;
            $branch->automaticPrinting = filter_var($request->automaticPrinting, FILTER_VALIDATE_BOOLEAN);
            $branch->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $branch->__v = 0;
            $branch->slug = $request->slug;
            $branch->contactEmail = $request->email;
            $branch->whatsappPhone = $request->whatsappPhone;

            $branch->save();

            $apiKeyResponse = $this->createToken($branch->name, new ObjectId($branch->_id), $branch->company);

            return response()->json([
                'message' => 'Unidade Criada com Sucesso!'
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Criar Unidade',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function branches(Request $request) {
        try {
            $id = $request->query('_id');
            $limit = $request->query('$limit', null);
            $company = $request->query('company');

            $query = Branch::query();

            if ($id) {
                $branchID = new ObjectId($id);
                $query->where('_id', $branchID);

                $existsQuery = clone $query;

                if (!$existsQuery->exists()) {
                    return response()->json([
                        'message' => 'Erro ao Listar Unidades',
                        'error' => 'Unidade não encontrada'
                    ], 404);
                }
            }

            if ($company) {
                $companyID = new ObjectId($company);
                $query->where('company', $companyID);

                $existsQuery = clone $query;

                if (!$existsQuery->exists()) {
                    return response()->json([
                        'message' => 'Erro ao Listar Unidades',
                        'error' => 'Unidades não encontradas'
                    ], 404);
                }
            }
            
            if ($limit === "false") {
                $limitValue = null;
            } elseif (is_null($limit)) {
                $limitValue = 10;
            } elseif (is_numeric($limit)) {
                $limitValue = (int) $limit;
            } else {
                $limitValue = null;
            }

            if (!is_null($limitValue)) {
                $query->limit($limitValue);
            }

            $branches = $query->get()->map(function ($branch) {
                return [
                    '_id' => (string) $branch->_id,
                    'updatedAt' => $branch->updatedAt,
                    'createdAt' => $branch->createdAt,
                    'name' => $branch->name,
                    'phone' => $branch->phone,
                    'company' => (string) $branch->company,
                    'barcodeReader' => $branch->barcodeReader,
                    'facebook' => $branch->facebook,
                    'storeInfo' => $branch->storeInfo,
                    'gateways' => $branch->gateways,
                    'takeAway' => $branch->takeAway,
                    'settingsTotem' => [
                        'splash' => [
                            'slideImageEnabled' => $branch->settingsTotem['splash']['slideImageEnabled'] ?? false,
                            'image' => array_map(function ($image) {
                                return [
                                    'type' => $image['type'] ?? '',
                                    'active' => $image['active'],
                                    '_id' => isset($image['id'])
                                        ? (string) $image['id']
                                        : null,
                                    'photo' => $image['photo']
                                ];
                            }, $branch->settingsTotem['splash']['image'] ?? []),
                            'video' => $branch->settingsTotem['splash']['video'] ?? '',
                            'preferredType' => $branch->settingsTotem['splash']['preferredType'] ?? '',
                            'slideImageSpeed' => $branch->settingsTotem['splash']['slideImageSpeed'] ?? ''
                        ],
                        'bannerHeader' => [
                            'slideImageEnabled' => $branch->settingsTotem['bannerHeader']['slideImageEnabled'] ?? false,
                            'image' => array_map(function ($image) {
                                return [
                                    'type' => $image['type'] ?? '',
                                    'active' => $image['active'],
                                    '_id' => isset($image['id'])
                                        ? (string) $image['id']
                                        : null,
                                    'photo' => $image['photo']
                                ];
                            }, $branch->settingsTotem['splash']['image'] ?? []),
                            'video' => $branch->settingsTotem['bannerHeader']['video'] ?? '',
                            'slideImageSpeed' => $branch->settingsTotem['bannerHeader']['slideImageSpeed'] ?? ''
                        ],
                        'totemOpenFreezerBtn' => $branch->settingsTotem['totemOpenFreezerBtn'] ?? false,
                        'enableMicroMarket' => $branch->settingsTotem['enableMicroMarket'] ?? false,
                        'askforCPF' => $branch->settingsTotem['askforCPF'] ?? false,
                        'allowPrinting' => $branch->settingsTotem['allowPrinting'] ?? false,
                        'totemAdminPassword' => $branch->settingsTotem['totemAdminPassword'] ?? [],
                        'totemSerialNumber' => $branch->settingsTotem['totemSerialNumber'] ?? '',
                        'lastProductUpdate' => $branch->settingsTotem['lastProductUpdate'] ?? ''
                    ],
                    'settingsWeb' => [
                        'bannerHeader' => [
                            'slideImageEnabled' => $branch->settingsWeb['bannerHeader']['slideImageEnabled'] ?? false,
                            'image' => array_map(function ($image) {
                                return [
                                    'active' => $image['active'],
                                    '_id' => (string) $image['id'],
                                    'photo' => $image['photo']
                                ];
                            }, $branch->settingsWeb['bannerHeader']['image'] ?? []),
                            'video' => $branch->settingsWeb['bannerHeader']['video'] ?? ''
                        ]
                    ],
                    'settingsApp' => [
                        'bannerHeader' => [
                            'slideImageEnabled' => $branch->settingsApp['bannerHeader']['slideImageEnabled'] ?? false,
                            'image' => array_map(function ($image) {
                                return [
                                    'active' => $image['active'] ?? false,
                                    'allowLink' => $image['allowLink'] ?? '',
                                    'routeId' => $image['routeId'] ?? '',
                                    'routeType' => $image['routeType'] ?? '',
                                    '_id' => (string) $image['id'] ?? '',
                                    'photo' => $image['photo'] ?? ''
                                ];
                            }, $branch->settingsApp['bannerHeader']['image'] ?? []),
                            'video' => $branch->settingsApp['bannerHeader']['video'] ?? ''
                        ]
                    ],
                    'serviceFee' => $branch->serviceFee,
                    'scheduling' => $branch->scheduling,
                    'printHtml' => $branch->printHtml,
                    'printers' => $branch->printers,
                    'printerColumnSize' => $branch->printerColumnSize,
                    'preferredOnlineMethod' => $branch->preferredOnlineMethod,
                    'paymentMethodsDefault' => $branch->paymentMethodsDefault,
                    'paymentMethods' => $branch->paymentMethods,
                    'blocksAndApartments' => $branch->blocksAndApartments,
                    'opened' => $branch->opened,
                    'normalizePrinting' => $branch->normalizePrinting,
                    'minPrice' => $branch->minPrice,
                    'locationTypes' => $branch->locationTypes,
                    'location' => $branch->location,
                    'isOnlinePaymentDisabled' => $branch->isOnlinePaymentDisabled,
                    'isDeliveryOnMinPrice' => $branch->isDeliveryOnMinPrice,
                    'integrations' => $branch->integrations,
                    'deliveryDistricts' => $branch->deliveryDistricts,
                    'copiesPrinting' => $branch->copiesPrinting,
                    'automaticPrinting' => $branch->automaticPrinting,
                    'active' => $branch->active,
                    '__v' => $branch->__v,
                    'preferredDeliverySystem' => $branch->preferredDeliverySystem,
                    'slug' => $branch->slug,
                    'staticImage' => $branch->staticImage
                ];
            });

            return response()->json([
                'total' => count($branches),
                'limit' => $limitValue,
                'skip' => 0,
                'data' => $branches
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Listar Unidades',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Request $request) {
        
        $validator = Validator::make($request->all(), [
            'id'                               => 'required|string',
            'active'                           => 'required',
            'name'                             => 'required|string',
            'slug'                             => 'required|string',
            'phone'                            => 'required|string',
            'whatsappPhone'                    => 'nullable|string',
            'email'                            => 'nullable|string',
            'franchise'                        => 'required|string',
            'street'                           => 'nullable|string',
            'neighborhood'                     => 'nullable|string',
            'complement'                       => 'nullable|string',
            'number'                           => 'nullable|string',
            'cep'                              => 'nullable|string',
            'city'                             => 'nullable|string',
            'state'                            => 'nullable|string',
            'latitude'                         => 'nullable|string',
            'longitude'                        => 'nullable|string',
            'storeInfo'                        => 'nullable|string',
            'adminPassword'                    => 'nullable|string',
            'serialNumber'                     => 'nullable|string',
            'controllerID'                     => 'nullable|string',
            'plugPagActivationKey'             => 'nullable|string',
            'openFreezerBtn'                   => 'required',
            'activeMicroMarket'                => 'required',
            'askForClientCPF'                  => 'required',
            'askForClientPassword'             => 'required',
            'askForClientPhone'                => 'required',
            'allowPrinting'                    => 'required',
            'paymentLock'                      => 'required',
            'memberShipMode'                   => 'required',
            'allowDelivery'                    => 'required',
            'whatsappBtn'                      => 'required',
            'isOnlinePaymentDisabled'          => 'required',
            'whatsappMessage'                  => 'nullable|string',
            'splashTotemImages'                => 'nullable|array',
            'splashTotemImages.*'              => 'file|mimes:jpeg,png,jpg',
            'bannerHeaderTotemImages'          => 'nullable|array',
            'bannerHeaderTotemImages.*'        => 'file|mimes:jpeg,png,jpg',
            'bannerHeaderWebImages'            => 'nullable|array',
            'bannerHeaderWebImages.*'          => 'file|mimes:jpeg,png,jpg',
            'bannerHeaderAppImages'            => 'nullable|array',
            'bannerHeaderAppImages.*'          => 'file|mimes:jpeg,png,jpg',
            'existingSplashTotemImages'        => 'nullable|string',
            'existingBannerHeaderTotemImages'  => 'nullable|string',
            'existingBannerHeaderWebImages'    => 'nullable|string',
            'existingBannerHeaderAppImages'    => 'nullable|string',
            'automaticPrinting'                => 'required',
            'normalizePrinting'                => 'required',
            'htmlPrinting'                     => 'required',
            'quantityPrintingCopies'           => 'nullable|string',
            'quantityPrintingColumns'          => 'nullable|string',
            'serviceFee'                       => 'nullable|string',
            'minPrice'                         => 'nullable|string',
            'useMinPriceOnDelivery'            => 'required',
            'schedulingOrders'                 => 'required',
            'minQuantitySO'                    => 'nullable|string',
            'maxQuantitySO'                    => 'nullable|string',
            'takeAwayOrders'                   => 'required',
            'minQuantityTAO'                   => 'nullable|string',
            'maxQuantityTAO'                   => 'nullable|string',
            'money'                            => 'required',
            'online'                           => 'required',
            'pix'                              => 'required',
            'pixDestinatary'                   => 'nullable|string',
            'pixKey'                           => 'nullable|string',
            'pixType'                          => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $branchID = new ObjectId($request->id);

            $branch = Branch::where('_id', $branchID)->first();

            if (!$branch) {
                return response()->json(['error' => 'Unidade não encontrada'], 404);
            }

            $branch->name = $request->name;
            $branch->phone = $request->phone;
            $branch->company = new ObjectId($request->franchise);
            $branch->barcodeReader = false;
            $branch->facebook = [
                "pixel" => ""
            ];
            $branch->storeInfo = $request->storeInfo;
            $branch->takeAway = [
                "active" => filter_var($request->takeAwayOrders, FILTER_VALIDATE_BOOLEAN),
                "min" => (integer) $request->minQuantityTAO,
                "max" => (integer) $request->maxQuantityTAO
            ];

            $splashImages = $this->mergeUploadedImagesWithExisting($request, 'splashTotemImages', $request->id);
            $bannerTotemImages = $this->mergeUploadedImagesWithExisting($request, 'bannerHeaderTotemImages', $request->id);

            $branch->settingsTotem = [
                "pix" => [
                    "type" => $request->pixType
                ],
                "totemOpenFreezerBtn" => filter_var($request->openFreezerBtn, FILTER_VALIDATE_BOOLEAN),
                "splash" => [
                    "slideImageEnabled" => true,
                    "image" => $splashImages,
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 3160
                ],
                "bannerHeader" => [
                    "slideImageEnabled" => true,
                    "image" => $bannerTotemImages,
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 7980
                ],
                "allowPrinting" => filter_var($request->allowPrinting, FILTER_VALIDATE_BOOLEAN),
                "enableMicroMarket" => filter_var($request->activeMicroMarket, FILTER_VALIDATE_BOOLEAN),
                "controllerId" => $request->controllerID,
                "totemAdminPassword" => [
                    "password" => $request->adminPassword,
                    "createdAt" => Carbon::now()->toIso8601String(),
                    "expirationDate" => Carbon::now()->addMinutes(10)->toIso8601String(),
                    "expirationInMinutes" => 10
                ],
                "askforCPF" => filter_var($request->askForClientCPF, FILTER_VALIDATE_BOOLEAN),
                "askforClientsPassword" => filter_var($request->askForClientPassword, FILTER_VALIDATE_BOOLEAN),
                "lastProductUpdate" => Carbon::now()->toIso8601String(),
                "paymentLock" => filter_var($request->paymentLock, FILTER_VALIDATE_BOOLEAN),
                "membershipMode" => filter_var($request->memberShipMode, FILTER_VALIDATE_BOOLEAN),
                "allowDelivery" => filter_var($request->allowDelivery, FILTER_VALIDATE_BOOLEAN),
                "totemSerialNumber" => $request->serialNumber,
                "plugPagActivationKey" => $request->plugPagActivationKey,
                "askforPhone" => filter_var($request->askForClientPhone, FILTER_VALIDATE_BOOLEAN),
                "askforPhoneIsMandatory" => false
            ];

            $bannerAppImages = $this->mergeUploadedImagesWithExisting($request, 'bannerHeaderAppImages', $request->id);

            $branch->settingsApp = [
                "whatsAppButton" => filter_var($request->whatsappBtn, FILTER_VALIDATE_BOOLEAN),
                "whatsAppNumber" => $request->whatsappPhone,
                "defaultWhatsAppMessage" => $request->whatsappMessage,
                "bannerHeader" => [
                    "slideImageEnabled" => true,
                    "image" => $bannerAppImages,
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 29631
                ]
            ];

            $bannerWebImages = $this->mergeUploadedImagesWithExisting($request, 'bannerHeaderWebImages', $request->id);

            $branch->settingsWeb = [
                "bannerHeader" => [
                    "slideImageEnabled" => true,
                    "image" => $bannerWebImages,
                    "video" => [
                        "enabled" => false,
                        "loop" => false,
                        "playing" => true
                    ],
                    "preferredType" => "Foto",
                    "slideImageSpeed" => 29631
                ]
            ];

            $branch->serviceFee = (float) $request->serviceFee;
            $branch->scheduling = [
                "active" => filter_var($request->schedulingOrders, FILTER_VALIDATE_BOOLEAN),
                "min" => (integer) $request->minQuantitySO,
                "max" => (integer) $request->maxQuantitySO
            ];
            $branch->printHtml = filter_var($request->htmlPrinting, FILTER_VALIDATE_BOOLEAN);
            $branch->printerColumnSize = (integer) $request->quantityPrintingColumns;
            $branch->preferredOnlineMethod = "Pagarme";
            $branch->paymentMethodsDefault = [
                "pix" => [
                    "receiverName" => $request->pixDestinatary,
                    "key" => $request->pixKey,
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => filter_var($request->pix, FILTER_VALIDATE_BOOLEAN),
                    "type" => $request->pixType,
                    "name" => "Pix"
                ],

                "iZettle" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "code" => "",
                    "name" => "iZettle"
                ],

                "online" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => filter_var($request->online, FILTER_VALIDATE_BOOLEAN),
                    "name" => "Online"
                ],

                "money" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => filter_var($request->money, FILTER_VALIDATE_BOOLEAN),
                    "name" => "Dinheiro"
                ],

                "credits" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "name" => "Créditos"
                ],

                "sodexo" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "name" => "Sodexo"
                ],

                "stone" => [
                    "locationTypes" => [
                        1,
                        2,
                        4,
                        8
                    ],
                    "active" => false,
                    "name" => "Stone"
                ]
            ];

            $branch->opened = false;
            $branch->normalizePrinting = filter_var($request->normalizePrinting, FILTER_VALIDATE_BOOLEAN);
            $branch->minPrice = (float) $request->minPrice;
            $branch->locationTypes = [
                1,
                2,
                4,
                8
            ];
            $branch->location = [
                "type" => "Point",
                "coordinates" => [
                    "latitude" => $request->latitude,
                    "longitude" => $request->longitude,
                ],
                "address" => [
                    "postalCode" => $request->cep,
                    "street" => $request->street,
                    "number" => $request->number,
                    "neighborhood" => $request->neighborhood,
                    "city" => $request->city,
                    "state" => $request->state,
                    "complement" => $request->complement
                ]
            ];
            $branch->isOnlinePaymentDisabled = filter_var($request->isOnlinePaymentDisabled, FILTER_VALIDATE_BOOLEAN);
            $branch->isDeliveryOnMinPrice = filter_var($request->useMinPriceOnDelivery, FILTER_VALIDATE_BOOLEAN);
            $branch->copiesPrinting = (integer) $request->quantityPrintingCopies;
            $branch->automaticPrinting = filter_var($request->automaticPrinting, FILTER_VALIDATE_BOOLEAN);
            $branch->active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN);
            $branch->__v = 0;
            $branch->slug = $request->slug;
            $branch->contactEmail = $request->email;
            $branch->whatsappPhone = $request->whatsappPhone;

            $branch->save();

            return response()->json([
                'message' => 'Unidade Editada com Sucesso!'
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao Editar Unidade',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function createToken(string $name, ObjectId $branch, ObjectId $company) {
        if (!$name || !$branch || !$company) {
            return [
                'message' => 'Erro na criação de Api Key',
                'error' => 'Há Dados Faltando',
                'status' => 422
            ];
        }

        try {
            $secretKey = env('JWT_SECRET_KEY');

            $payload = [
                'audience' => "https://yourdomain.com",
                'expiresIn' => '100y',
                'subject' => "anonymous",
                'issuer' => 'Laravel'
            ];

            $jwt = JWT::encode($payload, $secretKey, 'HS256');

            $apiKey = new Apikey();

            $apiKey->name = $name;
            $apiKey->company = $company;
            $apiKey->key = $jwt;
            $apiKey->branches = [
                $branch
            ];
            $apiKey->__v = 0;

            $apiKey->save();

            return [
                'message' => 'Sucesso na criação de Api Key',
                'status' => 200
            ];
        } catch (\Exception $e) {
            return [
                'message' => 'Erro na criação de Api Key',
                'error' => $e->getMessage(),
                'status' => 500
            ];
        }
    }

    private function mergeUploadedImagesWithExisting(Request $request, string $field, string $prefix): array {
        $result = [];
    
        $existing = json_decode($request->input('existing' . ucfirst($field)), true) ?? [];
    
        foreach ($existing as $img) {
            if (is_string($img)) {
                $result[] = [
                    "photo" => $img,
                    "type" => "image",
                    "active" => true,
                    "_id" => new ObjectId()
                ];
            } elseif (is_array($img) && isset($img['photo'])) {
                $result[] = [
                    "photo" => $img['photo'],
                    "type" => $img['type'] ?? "image",
                    "active" => $img['active'] ?? true,
                    "_id" => isset($img['_id']) ? new ObjectId($img['_id']) : new ObjectId()
                ];
            }
        }

        if ($request->hasFile($field)) {
            foreach ($request->file($field) as $file) {
                $path = Storage::disk('s3')->put($prefix, $file);
                $result[] = [
                    "photo" => env('AWS_URL') . '/' . $path,
                    "type" => "image",
                    "active" => true,
                    "_id" => new ObjectId()
                ];
            }
        }
    
        return $result;
    }      
}