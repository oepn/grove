<?php

namespace Grove\Http\Controllers;

use App;
use Cache;
use Illuminate\Support\Collection;
use ParsedownExtra;
use Spatie\YamlFrontMatter\Parser;
use Storage;
use View;

class ProjectController extends Controller
{
    protected $cacheTime = 60;

    /** @var Collection */
    protected $projects;

    protected $frontMatterParser;

    protected $markdown;

    public function __construct(Parser $frontMatterParser, ParsedownExtra $markdown)
    {
        $this->frontMatterParser = $frontMatterParser;
        $this->markdown = $markdown;

        $this->projects = Cache::remember('projects', $this->cacheTime, function () {
            $projects = array_reduce(Storage::files(), function ($acc, $filename) {
                $parsed = $this->frontMatterParser->parse(Storage::get($filename));
                $acc[basename($filename, '.md')] = [
                    'meta' => $parsed->matter(),
                    'body' => $parsed->body()
                ];

                return $acc;
            }, []);

            return collect($projects);
        });
    }

    public function home()
    {
        $projects = $this->projects->pluck('meta');

        return View::make('home', [
            'projects' => $projects
        ]);
    }

    public function project($slug)
    {
        // Ensure slug is properly formatted
        $slug = str_slug($slug);

        if ( ! isset($this->projects[$slug])) {
            App::abort(404);
        };

        $data = Cache::remember('project_'.$slug, $this->cacheTime, function () use ($slug) {
            $project = $this->projects[$slug];

            return [
                'project' => $project['meta'],
                'body' => $this->markdown->parse($project['body'])
            ];
        });

        return View::make('portfolio.show', $data);
    }
}
