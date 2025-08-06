<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    /**
     * Display calorie history - redirect to statistics.
     */
    public function index()
    {
        // Redirect history to statistics page with history tab
        return redirect()->route('statistics.weekly', ['tab' => 'history']);
    }
}
