<?php

Route::get('/', ['as' => 'home', function () {
    return view('home');
}]);

Route::get('portfolio/{slug}', ['as' => 'portfolio.show', function ($slug) {
    return view('portfolio.show', compact('slug'));
}]);
