def identify_transshipment_nodes(routes, traffic_data, max_capacity):
    overloaded_stops = {}
    congested_stops = {}

    # Step 1: Identify overloaded stops
    for route in routes:
        for stop in route.stops:
            if stop.passenger_count > max_capacity:
                overloaded_stops[stop.name] = stop.passenger_count

    # Step 2: Identify congested stops
    for data in traffic_data:
        if data.congestion_level > 0.7:  # Threshold for high congestion
            congested_stops[data.stop_name] = data.congestion_level

    # Step 3: Determine transshipment nodes
    transshipment_nodes = []

    for route in routes:
        for stop in route.stops:
            if stop.name in overloaded_stops or stop.name in congested_stops:
                transshipment_nodes.append({
                    "stop": stop.name,
                    "location": stop.location,
                    "action": "Increase buses" if stop.name in overloaded_stops else "Reroute passengers",
                })

    return transshipment_nodes