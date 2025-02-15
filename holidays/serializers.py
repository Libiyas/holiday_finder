from rest_framework import serializers

class StateSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    abbrev = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    exception = serializers.CharField(allow_null=True, required=False)
    iso = serializers.CharField(required=False)

class FlexibleStatesField(serializers.Field):
    """Handles cases where `states` can be a string or a list of dictionaries."""

    def to_representation(self, value):
        return value  # Return the value as is

    def to_internal_value(self, data):
        if isinstance(data, str):
            return data  # If it's a string, return as is
        elif isinstance(data, list):
            return [StateSerializer().to_internal_value(item) for item in data]  # Validate each state dictionary
        else:
            raise serializers.ValidationError("Invalid format for states field")

class HolidaySerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True, allow_null=True)
    date = serializers.DictField()
    type = serializers.ListField(child=serializers.CharField())
    locations = serializers.CharField(allow_blank=True, allow_null=True)
    states = FlexibleStatesField(required=False)
