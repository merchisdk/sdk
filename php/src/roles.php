<?php



abstract class Roles
{
    const _PUBLIC = 0;  // _ because public is a php keyword
    const ADMIN = 1;
    const SALES = 2;
    const DESIGNER = 3;
    const SUPPLIER = 4;
    const CLIENT = 5;
    const MANAGER = 6;
    const ACCOUNTANT = 7;

    const ROLE_STRINGS = array(
                _PUBLIC => "public",
                ADMIN => "admin",
                SALES => "sales",
                DESIGNER => "designer",
                SUPPLIER => "supplier",
                CLIENT => "client",
                MANAGER => "manager",
                ACCOUNTANT => "accountant");

    const ROLE_CSS_CLASS = array(
                  _PUBLIC => "default",
                  ADMIN => "inverse",
                  SALES => "success",
                  DESIGNER => "success",
                  SUPPLIER => "warning",
                  CLIENT => "danger",
                  MANAGER => "primary",
                  ACCOUNTANT => 'info');
}
