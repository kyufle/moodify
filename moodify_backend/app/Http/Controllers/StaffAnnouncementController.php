<?php
// app/Http/Controllers/StaffAnnouncementController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StaffAnnouncement;
use Illuminate\Support\Facades\Log;

class StaffAnnouncementController extends Controller
{
    // Obtener todos los anuncios (Para todos los usuarios)
    public function index()
    {
        return response()->json(StaffAnnouncement::latest()->get());
    }

    // Guardar nuevo anuncio (Solo Admin)
    public function store(Request $request)
    {
        try {
            // Verificación extra de seguridad basada en tu tabla users
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
    // Buscamos el anuncio
    $announcement = StaffAnnouncement::find($id);

    if (!$announcement) {
        return response()->json(['message' => 'Aviso no encontrado'], 404);
    }

    // Opcional: Verificar aquí también si el usuario es admin
    if (auth()->user()->type_user !== 'admin') {
        return response()->json(['message' => 'No tienes permiso'], 403);
    }

    $announcement->delete();

    return response()->json(['message' => 'Aviso borrado correctamente'], 200);
}
}
?>