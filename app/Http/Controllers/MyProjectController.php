<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PostProjectController extends Controller
{
    public function show()
    {
        return Inertia::render('MyProject');
    }
}
