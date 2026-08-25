<?php

namespace App\Enum;
enum CustomerContactStatusEnum: int
{
    case RECEIVED = 1;
    case IN_PROGRESS = 2;
    case COMPLETED = 3;
    case CANCELED = 4;
}
