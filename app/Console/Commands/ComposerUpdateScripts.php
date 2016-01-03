<?php

namespace Grove\Console\Commands;

use Illuminate\Console\Command;

class ComposerUpdateScripts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run post-update scripts';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($this->laravel->environment('local')) {
            $this->call('ide-helper:generate');
            $this->call('ide-helper:meta');
        }
    }
}
