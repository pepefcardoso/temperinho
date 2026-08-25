<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMockingConsoleOutput();
    }

    public function resolveApplication(): \Illuminate\Foundation\Application
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }
}
