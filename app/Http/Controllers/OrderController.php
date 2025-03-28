<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\CentralLogics\Helpers;
use MongoDB\BSON\ObjectId;
use App\Models\Order;
use App\Models\Branch;
use App\Models\Categorygroup;
use App\Models\Product;
use App\Models\Productcategory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller {

    public function create(Request $request){
        $validator = Validator::make($request->all(), [
            'amount'                     => 'required',
            'subtotal'                   => 'required',
            'total'                      => 'required',
            'branch'                     => 'required',
            'inutriOrder'                => 'nullable',
            'inutriOrderDeliveryAddress' => 'nullable',
            'change'                     => 'required',
            'pinpadResponse'             => 'nullable',
            'coupon'                     => 'nullable',
            'simpleAuth'                 => 'required',
            'totemClientName'            => 'required',
            'cpfCustomer'                => 'nullable',
            'totemNF_email'              => 'nullable',
            'deliveryFee'                => 'required',
            'items'                      => 'required',
            'location'                   => 'nullable',
            'totemVersion'               => 'required',
	        'locationType'               => 'required',
            'offers'                     => 'nullable',
            'discount'                   => 'nullable',
            'paymentMethod'              => 'required',
            'phone'                      => 'nullable',
            'withdrawalTime'             => 'nullable',
            'note'                       => 'nullable',
            'appInfo'                    => 'nullable',
            'deliveryTime'               => 'nullable',
            'additionalInfo'             => 'required',
            'installments'               => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => Helpers::error_processor($validator)], 422);
        };

        $order = New Order();

        $order->amount = $request->amount;
        $order->subtotal = $request->subtotal;
        $order->total = $request->total;
        $order->branch = $request->branch;
        $order->inutriOrder = $request->inutriOrder ?? null;
        $order->inutriOrderDeliveryAddress = $request->inutriOrderDeliveryAddress ?? null;
        $order->change = $request->change;
        $order->pinpadResponse = $request->pinpadResponse ?? null;
        $order->coupon = $request->coupon ?? null;
        $order->simpleAuth = $request->simpleAuth;
        $order->totemClientName = $request->totemClientName;
        $order->cpfCustomer = $request->cpfCustomer ?? null;
        $order->totemNF_email = $request->totemNF_email ?? null;
        $order->deliveryFee = $request->deliveryFee;
        $order->items = $request->items;
        $order->location = $request->location ?? [
            "type" => "Point",
            "coordinates" => [0, 0],
            "address" => [
                "coordinates" => [0, 0]
            ]
        ];
        $order->totemVersion = $request->totemVersion;
        $order->locationType = $request->locationType;
        $order->offers = $request->offers ?? [];
        $order->discount = $request->discount ?? null;
        $order->paymentMethod = $request->paymentMethod;
        $order->phone = $request->phone ?? null;
        $order->withdrawalTime = $request->withdrawalTime ?? null;
        $order->note = $request->note ?? null;
        $order->appInfo = $request->appInfo ?? null;
        $order->deliveryTime = $request->deliveryTime ?? null;
        $order->additionalInfo = $request->additionalInfo;
        $order->installments = $request->installments;
        $order->status = 1;
        $order->__v = 0;
        $latestOrder = Order::where('branch', $request->branch)->orderBy('createdAt', 'desc')->first();

        if ($latestOrder) {
            $createdAt = Carbon::parse($latestOrder->createdAt)->timezone('America/Fortaleza');

            if ($createdAt->isToday()) {
                $order->seqPanel = $latestOrder->seqPanel + 1;
            } else {
                $order->seqPanel = 1;
            }
        }
        $order->seq = $latestOrder->seq + 1;

        $order->save();

        return response()->json($order, 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function getDetails(Request $request) {
        $orderId = new ObjectId($request->query('id'));
        $order = Order::where('_id', $orderId)->first();

        if (!$order) {
            return response()->json(['error' => 'Pedido não encontrado'], 404);
        }

        $branchId = new ObjectId($order->branch);
        $branchData = Branch::where('_id', $branchId)->first();

        $PdvOrderType = [
            1 => "DELIVERY",
            2 => "TOGO",
            4 => "ESTABLISHMENT",
        ];

        $response = [
            'createdAt' => $order->createdAt,
            'updatedAt' => $order->updatedAt,
            'id' => (string) $order->_id,
            'seq' => $order->seq,
            'type' => $PdvOrderType[$order->locationType] ?? null,
            'merchant' => [
                'id' => (string) $branchData->_id,
                'name' => $branchData->name,
                'phones' => [$branchData->phone],
                'address' => [
                    'formattedAddress' => $branchData->location['address']['street'] . ' - ' . $branchData->location['address']['number'] . ' - ' . $branchData->location['address']['city'] . ' - ' . $branchData->location['address']['state'] ?? null,
                    'country' => 'BR',
                    'state' => $branchData->location['address']['state'] ?? null,
                    'city' => $branchData->location['address']['city'] ?? null,
                    'neighborhood' => $branchData->location['address']['neighborhood'] ?? null,
                    'streetName' => $branchData->location['address']['street'] ?? null,
                    'streetNumber' => $branchData->location['address']['number'] ?? null,
                    'postalCode' => $branchData->location['address']['postalCode'] ?? null,
                ]
            ],
            'additionalInfo' => $order->additionalInfo ?? null,
            'payment' => [
                'kind' => $order->paymentMethod['kind'] ?? null,
                'label' => $order->paymentMethod['label'] ?? null,
                'code' => $order->paymentMethod['code'] ?? null
            ],
            'pinpadResponse' => $order->pinpadResponse ?? null,
            'customer' => [
                'id' => (string) $order->customer ?? null,
                'name' => $order->totemClientName ?? null,
                'taxPayerIdentificationNumber' => $order->cpfCustomer ?? null,
                'email' => $order->totemNF_email ?? null,
                'cpf' => $order->cpfCustomer ?? null,
            ],
            'items' => array_map(function($item) {
                $productId = new ObjectId($item['product']);
                $product = Product::where('_id', $productId)->first();

                $categoryId = new ObjectId($product->category);
                $category = Productcategory::where('_id', $categoryId)->first();

                $totalComplements = array_reduce($item->complements ?? [], function ($sum, $c) {
                    return $sum + ($c['price'] * $c['quantity']);
                }, 0);

                return [
                    'reference' => (string) $item['product'],
                    'name' => $item['title'],
                    'quantity' => $item['quantity'],
                    'category_group' => $category ? [
                        '_id' => (string) $category->_id,
                        'name' => $category->name
                    ] : [],
                    'price' => round((float) $item['price'], 2),
                    'subItemsPrice' => round((float) $totalComplements, 2),
                    'totalPrice' => round((float) $item['price'] * $item['quantity'], 2),
                    'externalCode' => $item['code'],
                    'observations' => $item['note'],
                    'subItems' => array_map(fn($subItem) => [
                        'reference' => $subItem->_id,
                        'name' => $subItem->title,
                        'quantity' => $subItem->quantity,
                        'price' => $subItem->price,
                        'totalPrice' => $subItem->price * $subItem->quantity,
                    ], $item->complements ?? [])
                ];
            }, $order->items),
            'subTotal' => $order->subtotal,
            'deliveryFee' => $order->deliveryFee,
            'discount' => $order->discount,
            'totalPrice' => $order->amount,
            'changeFor' => $order->change ?? 0,
            'deliveryAddress' => [
                    'formattedAddress' => $branchData->location['address']['street'] . ' - ' . $branchData->location['address']['number'] . ' - ' . $branchData->location['address']['city'] . ' - ' . $branchData->location['address']['state'] ?? null,
                    'country' => 'BR',
                    'state' => $branchData->location['address']['state'] ?? null,
                    'city' => $branchData->location['address']['city'] ?? null,
                    'coordinates' => [
                        'latitude' => $order->location['address']['coordinates'][0] ?? null,
                        'longitude' => $order->location['address']['coordinates'][1] ?? null,
                    ],
                    'neighborhood' => $branchData->location['address']['neighborhood'] ?? null,
                    'streetName' => $branchData->location['address']['street'] ?? null,
                    'streetNumber' => $branchData->location['address']['number'] ?? null,
                    'postalCode' => $branchData->location['address']['postalCode'] ?? null,
                    'reference' => $order->location['address']['reference'] ?? null,
                    'complement' => $order->location['address']['complement'] ?? null
                ]
        ];

        return response()->json($response, 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function statuses(Request $request, $id, $status) {
        $orderId = new ObjectId($id);

        $orderStatus = strtoupper($status);

        $translatestatus = [
            'PENDING_APPROVAL'     => 1,
            'APPROVED'             => 2,
            'OUT_FOR_DELIVERY'     => 4,
            'DELIVERED'            => 8,
            'CANCELLED'            => 16,
            'REFUSED'              => 32,
            'REFUNDED'             => 64,
            'AT_ESTABLISHMENT'     => 128,
            'WAITING_FOR_FINISH'   => 256,
            'FINISHED'             => 512,
            'WAITING_FOR_DELIVERY' => 1024
        ];

        $statusTranslated = $translatestatus[$orderStatus];

        if($orderStatus === 1) {
            if($statusTranslated === 2 || $statusTranslated === 32) {
                return response()->json(
                    'Invalid Operation: PENDING_APPROVAL order only be changed to APPROVED or REFUSED',
                    400, [], JSON_UNESCAPED_SLASHES
                );
            }
        }

        if($orderStatus === 4) {
            if($statusTranslated === 8 || $statusTranslated === 16) {
                return response()->json(
                    'Invalid Operation: OUT_FOR_DELIVERY order only be changed to DELIVERED or CANCELLED',
                    400, [], JSON_UNESCAPED_SLASHES
                );
            }
        }

        $order = Order::where('_id', $orderId)->first();
        $order->status = $statusTranslated;
        $order->save();

        return response()->json(['message' => 'Pedido Atualizado com Sucesso!'], 200, [], JSON_UNESCAPED_SLASHES);
    }
}
