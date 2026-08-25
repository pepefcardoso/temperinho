<?php

namespace App\Enum;
enum RecipeDifficultyEnum: int
{
    case MUITO_DIFICIL = 5;
    case DIFICIL = 4;
    case NORMAL = 3;
    case FACIL = 2;
    case MUITO_FACIL = 1;
}
