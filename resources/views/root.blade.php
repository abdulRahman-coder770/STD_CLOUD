<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <title>Student Cloud</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="node_modules/react-bootstrap-toggle/dist/bootstrap2-toggle.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
<div id="root">
    @csrf
</div>
{{--<script>--}}
{{--    let a_tok = document.querySelector('meta[name="csrf-token"]').content;--}}

{{--    //suscribing to pusher channel--}}
{{--    Pusher.logToConsole = true;--}}
{{--    var pusher = new Pusher('145fd4707199ab20c070', {--}}
{{--        cluster: 'ap2',--}}
{{--        authEndpoint:'/broadcasting/auth',--}}
{{--        auth:{--}}
{{--            headers:{--}}
{{--                'X-CSRF-TOKEN':a_tok--}}
{{--            }--}}
{{--        }--}}
{{--    });--}}
{{--</script>--}}
<script>

</script>
<script src="{{asset('js/app.js')}}"></script>
</body>
</html>

