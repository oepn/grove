<?php

use Symfony\Component\Yaml\Yaml;

Route::get('/', ['as' => 'home', function () {
    return view('home');
}]);

Route::get('portfolio/{slug}', ['as' => 'portfolio.show', function ($slug) {
    $projects = Yaml::parse(file_get_contents(resource_path('data/projects.yml')));

    if ( ! isset($projects[$slug])) {
        App::abort(404);
    }

    $project = $projects[$slug];
    $project['description'] = ParsedownExtra::instance()->text($project['description']);

    return view('portfolio.show', [
        'project' => $project
    ]);
}]);
