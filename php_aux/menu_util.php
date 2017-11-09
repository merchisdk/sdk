<?php

const MAIN = 0;
const FOOTER = 1;
const OTHER = 2;

$menu_type_array = [MAIN => "Main menu",
                    FOOTER => "Footer menu",
                    OTHER => "Other menu"];

const REDIRECT = 0;
const INTERNAL_PAGE = 1;

$menu_item_type_array = [REDIRECT => "Redirect",
                         INTERNAL_PAGE => "Internal"];
