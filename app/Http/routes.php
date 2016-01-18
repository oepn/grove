<?php

Route::get('/', ['as' => 'home', 'uses' => 'ProjectController@home']);
Route::get('portfolio/{slug}', ['as' => 'portfolio.show', 'uses' => 'ProjectController@project']);
