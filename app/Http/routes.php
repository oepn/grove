<?php

Route::get('/', function () {
    return view('home');
});

Route::get('portfolio/{slug}', function ($slug) {
    return view('portfolio.show', compact('slug'));
});
