---
title: Making an Order
position: 3
parameters:
  - name:
    content:
content_markdown: |-
    The following example shows how to make a web form using the PHP SDK which
    accepts information from a user about quantity, shipping address, and so
    on, and which when places an order for a product with merchi.

    The example code requires 'products.php' and 'order_helper.php', both of
    which are distributed with the SDK. You should change the value of
    `$domain` to reflect the `id` of the merchi store that the order should
    be placed with.
left_code_blocks:
  - code_block: |-
      <?php
    require_once 'products.php';
    require_once 'order_helper.php';

    $domain = 1; // this should be set to the sales site id
    $sitename = "Example Merchi Order Form";

    $validates = true;
    $resultMsg  = '';

    $name = '';
    $nameErr = '';

    $emailAddress = '';
    $emailAddressErr = '';

    $phoneCode = 'AU';
    $phoneCodeErr = '';

    $phoneNumber = '';
    $phoneNumberErr = '';

    $lineOne = '';
    $lineOneErr = '';

    $lineTwo = '';
    $lineTwoErr = '';

    $city = '';
    $cityErr = '';

    $state = '';
    $stateErr = '';

    $country = '';
    $countryErr = '';

    $postcode = '';
    $postcodeErr = '';

    $product = '';
    $productErr = '';

    $quantity = '';
    $quantityErr = '';

    $notes = '';
    $notesErr = '';

    $company = '';
    $companyErr = '';

    $product_list = get_products_for_domain($domain);

    function generate_notes()
    {
        global $sitename, $product_list, $product, $notes, $quantity;
        $result = "order from: $sitename\n";
        foreach ($product_list as $a_product) {
            if ($a_product->id == $product) {
                $result .= "product: $a_product->name\n";
                break;
            }
        }
        $result .= "size: example data only\n";
        $result .= "colour: example data only\n";
        $result .= "ordered qty: $quantity\n";
        $result .= "client notes follow: \n$notes\n";
        return $result;
    }

    function transpose($file_post)
    {
        $file_ary = [];
        $file_count = count($file_post['name']);
        $file_keys = array_keys($file_post);

        for ($i = 0; $i < $file_count; $i++) {
            foreach ($file_keys as $key) {
                $file_ary[$i][$key] = $file_post[$key][$i];
            }
        }
        return $file_ary;
    }

    function text_input($label, $id, $value, $err)
    {
        echo "<div>";
        echo "<label for=\"$id\">$label:</label>";
        echo "<input type=\"text\" id=\"$id\" name=\"$id\"";
        $value = htmlspecialchars($value);
        echo "  value=\"$value\">";
        echo $err;
        echo "</div>";
    }

    function product_select()
    {
        global $product_list, $product;
        echo "<div><label for=\"product\">product:</label>";
        echo "<select name=\"product\">";
        foreach ($product_list as $a_product) {
            $name = htmlspecialchars($a_product->name);
            echo "<option value=\"$a_product->id\"";
            if ($a_product->id == $product) {
                echo ' selected';
            }
            echo ">$name</option>";
        }
        echo "</select></div>";
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = $_POST["name"];
        if (empty($name)) {
            $nameErr = "name is required";
            $validates = false;
        }
        $emailAddress = $_POST["emailAddress"];
        if (empty($emailAddress)) {
            $emailAddressErr = "email address is required";
            $validates = false;
        }
        $phoneNumber = $_POST["phoneNumber"];
        if (empty($phoneNumber)) {
            $phoneNumberErr = "phone number is required";
            $validates = false;
        }
        $lineOne = $_POST["lineOne"];
        if (empty($lineOne)) {
            $lineOneErr = "line one is required";
            $validates = false;
        }
        $lineTwo = $_POST["lineTwo"];
        $city = $_POST["city"];
        if (empty($city)) {
            $cityErr = "city is required";
            $validates = false;
        }
        $state = $_POST["state"];
        $country = $_POST["country"];
        if (empty($country)) {
            $countryErr = "country is required";
            $validates = false;
        }
        $postcode = $_POST["postcode"];
        $product = $_POST["product"];
        if (empty($product)) {
            $productErr = "product is required";
            $validates = false;
        }
        $quantity = $_POST["quantity"];
        if (empty($quantity)) {
            $quantityErr = "quantity is required.";
            $validates = false;
        }
        if (!is_numeric($quantity) || $quantity < 1) {
            $quantityErr = "please enter a valid quantity";
            $validates = false;
        }
        $quantity = intval($quantity);
        $phoneCode = $_POST["phoneCode"];
        if (empty($phoneCode)) {
            $phoneCodeErr = "phone area code is required";
            $validates = false;
        }
        $notes = $_POST["notes"];
        $company = $_POST["company"];

        if ($validates) {
            try {
                place_order($lineOne, $lineTwo, $city, $state, $country,
                            $postcode, $emailAddress, $phoneCode, $phoneNumber,
                            $name, $company, $product, $quantity, $domain,
                            generate_notes(), transpose($_FILES['files']));
                $resultMsg = 'order has been placed!';
            } catch (Exception $e) {
                $msg = htmlspecialchars($e->getMessage());
                $resultMsg = 'error from server: ' . $msg;
            }
        } else {
            $resultMsg = 'validation failed';
        }
    }

?>

<html>
    <head>
        <title>
            Example Merchi Order Form
        </title>
        <style>
            div { margin: 10px; }
        </style>
    </head>
    </body>
        <div>
            <?php echo $resultMsg ?>
        </div>
        <div>
            <h1>Example Merchi Order Form</h1>
        </div>
        <form method="post"
              action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"
              enctype="multipart/form-data">
            <div>
                <?php text_input("name", "name", $name, $nameErr) ?>
                <?php text_input("email address", "emailAddress", $emailAddress,
                                 $emailAddressErr) ?>
                <?php text_input("area code", "phoneCode", $phoneCode,
                                 $phoneCodeErr) ?>
                <?php text_input("phone number", "phoneNumber", $phoneNumber,
                                 $phoneNumberErr) ?>
                <?php text_input("line one", "lineOne", $lineOne,
                                 $lineOneErr) ?>
                <?php text_input("line two", "lineTwo", $lineTwo,
                                 $lineTwoErr) ?>
                <?php text_input("city", "city", $city, $cityErr) ?>
                <?php text_input("state", "state", $state, $stateErr) ?>
                <?php text_input("country", "country", $country, $countryErr) ?>
                <?php text_input("postcode", "postcode", $postcode,
                                 $postcodeErr) ?>
                <?php product_select() ?>
                <?php text_input("quantity", "quantity", $quantity,
                                 $quantityErr) ?>
                <?php text_input("notes", "notes", $notes, $notesErr) ?>
                <?php text_input("company", "company", $company, $companyErr) ?>
                <label>Upload logo or design files:</label><br />
                <div id="file-container">
                </div>
                <a href="#" id="file-add">Upload another</a>
            </div>
            <div>
                <input type="submit" value="place order">
            </div>
        </form>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js">
    </script>
    <script>
        function add() {
            $('#file-container').append('<input name="files[]" type="file"><br />');
        }
        $('#file-add').on('click', function (e) {
            add();
            e.preventDefault();
        });
        add();
    </script>
    </body>
    </html>
    title: Merchi order placement form
    language: php
---
