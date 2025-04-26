<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\CentralLogics\Helpers;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class EventController extends Controller {

    public function polling(Request $request) {
        $branch = $request->query('branch');
        $branchId = new ObjectId($branch);

        $startOfDay = Carbon::today()->utc();
        $endOfDay = Carbon::today()->utc()->endOfDay();

        $events = Event::where('branchId', $branchId)
            ->where('integrated', false)
            ->whereBetween('createdAt', [$startOfDay, $endOfDay])
            ->get();

        return response()->json($events, 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function acknowledgment(Request $request) {
        $validator = Validator::make($request->all(), [
            'ids'      => 'required|array',
            'ids.*.id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => Helpers::error_processor($validator)], 422);
        }

        $eventIds = array_map(fn($obj) => new ObjectId($obj['id']), $request->ids);

        $events = Event::whereIn('_id', $eventIds)->get();

        if ($events->isEmpty()) {
            return response()->json(['error' => 'Nenhum evento encontrado'], 404);
        }

        foreach ($events as $event) {
            $event->integrated = true;
            $event->save();
        }

        return response()->json([
            'message' => 'Pedidos Integrados com Sucesso!',
            'eventIds' => array_map(fn($id) => (string) $id, $eventIds)
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }
}
