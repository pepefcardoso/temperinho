<?php

namespace Tests\Unit;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class SentryConfigTest extends TestCase
{
    #[Test]
    public function sentry_does_not_send_personal_data_by_default()
    {
        $this->assertFalse(
            config('sentry.send_default_pii'),
            'SENTRY_SEND_DEFAULT_PII must default to false to avoid sending user PII to a third party (LGPD).'
        );
    }

    #[Test]
    public function expected_user_facing_exceptions_are_ignored()
    {
        $ignored = config('sentry.ignore_exceptions');

        $this->assertContains(\Illuminate\Validation\ValidationException::class, $ignored);
        $this->assertContains(\Illuminate\Auth\AuthenticationException::class, $ignored);
    }
}
