<?php

class PageTest extends TestCase
{
    public function testIndexLoads()
    {
        $this->visit('/')
            ->see('Nathaniel');
    }
}
