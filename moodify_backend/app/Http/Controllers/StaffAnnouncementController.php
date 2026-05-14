<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StaffAnnouncement;
use Illuminate\Support\Facades\Log;

class StaffAnnouncementController extends Controller
{
    public function index()
    {
        return response()->json(StaffAnnouncement::latest()->get());
    }

    public function store(Request $request)
    {
        try {
            if ($request->user()->type_user !== 'admin') {
                return response()->json(['error' => 'No autorizado'], 403);
            }

            $validated = $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'tag' => 'required|string',
                'icon' => 'required|string',
                'colors' => 'required|array',
            ]);

            $announcement = StaffAnnouncement::create($validated);

            return response()->json($announcement, 201);
        } catch (\Exception $e) {
            Log::error("Error en StaffAnnouncement: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroy($id)
{
    $announcement = StaffAnnouncement::find($id);

    if (!$announcement) {
        return response()->json(['message' => 'Aviso no encontrado'], 404);
    }

    if (auth()->user()->type_user !== 'admin') {
        return response()->json(['message' => 'No tienes permiso'], 403);
    }

    $announcement->delete();

    return response()->json(['message' => 'Aviso borrado correctamente'], 200);
}
}
?>