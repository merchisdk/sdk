<?php

function is_assoc($x)
{
    return is_array($x) && (bool) count(array_filter(array_keys($x),
                                                     'is_string'));
}
