grams = 1
kilograms = 1000 * grams
millimeters = 1
centermeters = 10 * millimeters
centermeters3 = centermeters ** 3
meters = 1000 * millimeters
meters3 = meters ** 3


def metric_weight(weight):
    """ Return weight in grams or kilograms depending on if grams are greater
        than 1000. Return unknown if no weight is provided.
    """
    if weight:
        if weight > kilograms:
            kg = float(weight) / kilograms
            return str(kg) + " kg"
        return str(weight) + " grams"
    return "Unknown"


def metric_volume(volume):
    """ Return volume in mm3, cm3 or m3 depending on if millimetres are greater
        than centermeters3 or meters3.
    """
    if volume:
        if volume > meters3:
            m3 = float(volume) / meters3
            return str(m3) + " m3"
        if volume > centermeters3:
            cm3 = float(volume) / centermeters3
            return str(cm3) + " cm3"
        return str(volume) + " mm3"
    return "Unknown"
