<?

$conf['endpoint']['local'] = 'http://alia:3030/gov/query';
$conf['home'] = '/var/www/gov/lodspeakr/';
$conf['basedir'] = 'http://alia/gov/';
$conf['debug'] = false;

/*ATTENTION: By default this application is available to
 * be exported and copied (its configuration)
 * by others. If you do not want that, 
 * turn the next option as false
 */ 
$conf['export'] = true;

#If you want to add/overrid a namespace, add it here
$conf['ns']['local']   = 'http://alia/gov/';
$conf['ns']['vizon']   = 'http://graves.cl/vizon/';

$lodspk['namedgraph'] = 'http://alia/metadata';
$lodspk['serverUri'] = 'http://alia';

$conf['mirror_external_uris'] = false;
$conf['root'] = 'editor.html';

$conf['disableComponents'] = false;
?>
